import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';

const source = readFileSync(resolve(process.cwd(), 'content.js'), 'utf8');

// Extract extractTweetData function
const extractStart = source.indexOf('function extractTweetData(');
const extractEnd = source.indexOf('\n}\n\n// Draft.js', extractStart) + 2;
const extractTweetData = Function(
  'buildArticleMarkdown',
  `return (${source.slice(extractStart, extractEnd)})`,
)(() => '');

// Extract context extraction functions
const contextBlock = source.match(/\/\/ --- tweet-context-extraction:start ---([\s\S]*?)\/\/ --- tweet-context-extraction:end ---/)?.[1];

class MockNode {
  constructor({ tag = 'div', attrs = {}, text = '', children = [] }) {
    this.tagName = tag.toUpperCase();
    this.attrs = { ...attrs };
    this._text = text;
    this.children = [];
    this.parentElement = null;
    this.isConnected = true;
    for (const child of children) {
      this.appendChild(child);
    }
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  getAttribute(name) {
    return this.attrs[name] ?? null;
  }

  hasAttribute(name) {
    return name in this.attrs;
  }

  get textContent() {
    if (this.children.length === 0) return this._text;
    const childTexts = this.children.map((c) => c.textContent).filter(Boolean);
    if (this._text) childTexts.push(this._text);
    return childTexts.join(' ');
  }

  matches(sel) {
    if (!sel) return false;
    const parts = sel.split(',').map((s) => s.trim());
    return parts.some((part) => {
      let tagPrefix = '';
      let attrPart = part;
      const bracketIdx = part.indexOf('[');
      if (bracketIdx > 0) {
        tagPrefix = part.slice(0, bracketIdx).toUpperCase();
        attrPart = part.slice(bracketIdx);
      } else if (bracketIdx === -1) {
        return this.tagName.toLowerCase() === part.toLowerCase();
      }

      if (tagPrefix && this.tagName !== tagPrefix) {
        return false;
      }

      if (attrPart.startsWith('[') && attrPart.endsWith(']')) {
        const inner = attrPart.slice(1, -1);
        if (inner.includes('*=')) {
          const [k, v] = inner.split('*=');
          const cleanV = v.replace(/^["']|["']$/g, '');
          return (this.attrs[k] || '').includes(cleanV);
        }
        if (inner.includes('=')) {
          const [k, v] = inner.split('=');
          const cleanV = v.replace(/^["']|["']$/g, '');
          return this.attrs[k] === cleanV;
        }
        return this.hasAttribute(inner);
      }

      return false;
    });
  }

  closest(sel) {
    let cur = this;
    while (cur) {
      if (cur.matches(sel)) return cur;
      cur = cur.parentElement;
    }
    return null;
  }

  querySelector(sel) {
    return this.querySelectorAll(sel)[0] || null;
  }

  querySelectorAll(sel) {
    const res = [];
    const walk = (node) => {
      for (const child of node.children) {
        if (child.matches(sel)) res.push(child);
        walk(child);
      }
    };
    walk(this);
    return res;
  }

  contains(node) {
    let cur = node;
    while (cur) {
      if (cur === this) return true;
      cur = cur.parentElement;
    }
    return false;
  }
}

function el(tag, attrs = {}, children = [], text = '') {
  return new MockNode({ tag, attrs, children, text });
}

function setupContextApi(customStore = new Map(), locationPath = '') {
  const tweetDataStore = customStore;
  const ctx = {
    tweetDataStore,
    location: { pathname: locationPath, origin: 'https://x.com' },
    document: {
      querySelectorAll: () => [],
      querySelector: () => null,
    },
    getStatusIdFromLocation: () => locationPath.match(/\/status\/(\d+)/)?.[1] || '',
    getTweetIdFromArticle: (art) => art?.getAttribute?.('data-xvm-tweet-id') || '',
    getTweetPermalinkFromArticle: (art, id) => id ? `https://x.com/user/status/${id}` : '',
    grokLastReplyThreadOg: null,
    URL,
  };
  vm.createContext(ctx);
  vm.runInContext(`
    ${contextBlock}
    this.extractTweetDetails = extractTweetDetails;
    this.formatSingleTweetDetails = formatSingleTweetDetails;
    this.getComprehensiveConversationContext = getComprehensiveConversationContext;
  `, ctx);
  return ctx;
}

describe('Multimodal & Context Extraction Pipeline', () => {
  describe('extractTweetData GraphQL parsing', () => {
    it('extracts photo alt text and media details from GraphQL response', () => {
      const tweetResult = {
        legacy: {
          id_str: '1001',
          full_text: 'Check this chart https://t.co/img1',
          created_at: 'Tue Jul 21 00:00:00 +0000 2026',
          favorite_count: 50,
          extended_entities: {
            media: [
              {
                type: 'photo',
                url: 'https://t.co/img1',
                media_url_https: 'https://pbs.twimg.com/media/chart.jpg',
                ext_alt_text: 'Q3 revenue growth YoY 94%',
              },
            ],
          },
        },
        views: { state: 'EnabledWithCount', count: '12000' },
        core: { user_results: { result: { legacy: { screen_name: 'analyst_pro' } } } },
      };

      const data = extractTweetData(tweetResult);
      expect(data).toBeDefined();
      expect(data.mediaList).toHaveLength(1);
      expect(data.mediaList[0]).toEqual({
        type: 'photo',
        url: 'https://pbs.twimg.com/media/chart.jpg',
        altText: 'Q3 revenue growth YoY 94%',
      });
      expect(data.screenName).toBe('analyst_pro');
    });

    it('extracts link preview card metadata and quote tweet from GraphQL response', () => {
      const tweetResult = {
        legacy: {
          id_str: '1002',
          full_text: 'Exciting announcement!',
          created_at: 'Tue Jul 21 00:00:00 +0000 2026',
        },
        views: { state: 'EnabledWithCount', count: '25000' },
        card: {
          legacy: {
            binding_values: [
              { key: 'title', value: { string_value: 'DeepSeek-V3 Technical Report' } },
              { key: 'description', value: { string_value: 'Detailed architecture and training overview' } },
              { key: 'vanity_url', value: { string_value: 'deepseek.com' } },
            ],
          },
        },
        quoted_status_result: {
          result: {
            legacy: {
              id_str: '999',
              full_text: 'Open source models are closing the gap.',
            },
            core: { user_results: { result: { legacy: { screen_name: 'sama' } } } },
          },
        },
      };

      const data = extractTweetData(tweetResult);
      expect(data).toBeDefined();
      expect(data.cardInfo).toEqual({
        title: 'DeepSeek-V3 Technical Report',
        description: 'Detailed architecture and training overview',
        domain: 'deepseek.com',
        url: '',
      });
      expect(data.quotedData).toEqual({
        id: '999',
        screenName: 'sama',
        text: 'Open source models are closing the gap.',
      });
    });
  });

  describe('DOM details extraction (extractTweetDetails & formatSingleTweetDetails)', () => {
    it('extracts author, primary text, and photo alt texts from DOM', () => {
      const article = el('article', { 'data-testid': 'tweet', 'data-xvm-tweet-id': '2001' }, [
        el('div', { 'data-testid': 'User-Name' }, [
          el('span', {}, [], 'Alice Developer'),
          el('div', {}, [], '@alice_dev'),
        ]),
        el('div', { 'data-testid': 'tweetText' }, [], 'We just open-sourced our real-time streaming pipeline!'),
        el('div', { 'data-testid': 'tweetPhoto' }, [
          el('img', { alt: 'Architecture diagram showing Kafka to WebRTC flow', src: 'https://pic.jpg' }),
        ]),
      ]);

      const ctx = setupContextApi();
      const details = ctx.extractTweetDetails(article);

      expect(details.authorHandle).toBe('@alice_dev');
      expect(details.authorName).toBe('Alice Developer');
      expect(details.text).toBe('We just open-sourced our real-time streaming pipeline!');
      expect(details.totalImages).toBe(1);
      expect(details.imageDescriptions).toEqual(['Architecture diagram showing Kafka to WebRTC flow']);

      const formatted = ctx.formatSingleTweetDetails(details);
      expect(formatted).toContain('【作者】: @alice_dev (Alice Developer)');
      expect(formatted).toContain('【正文】:\nWe just open-sourced our real-time streaming pipeline!');
      expect(formatted).toContain('【配图说明】: "Architecture diagram showing Kafka to WebRTC flow"');
    });

    it('filters out generic alt texts (e.g. "Image", "图像") while counting total images', () => {
      const article = el('article', { 'data-testid': 'tweet', 'data-xvm-tweet-id': '2002' }, [
        el('div', { 'data-testid': 'User-Name' }, [], '@bob'),
        el('div', { 'data-testid': 'tweetText' }, [], 'Two photos attached.'),
        el('div', { 'data-testid': 'tweetPhoto' }, [
          el('img', { alt: 'Image', src: 'https://pic1.jpg' }),
        ]),
        el('div', { 'data-testid': 'tweetPhoto' }, [
          el('img', { alt: '图像', src: 'https://pic2.jpg' }),
        ]),
      ]);

      const ctx = setupContextApi();
      const details = ctx.extractTweetDetails(article);

      expect(details.totalImages).toBe(2);
      expect(details.imageDescriptions).toEqual([]);

      const formatted = ctx.formatSingleTweetDetails(details);
      expect(formatted).toContain('【配图】: 共 2 张图片');
      expect(formatted).not.toContain('【配图说明】');
    });

    it('extracts external link preview card from DOM', () => {
      const article = el('article', { 'data-testid': 'tweet', 'data-xvm-tweet-id': '2003' }, [
        el('div', { 'data-testid': 'User-Name' }, [], '@charlie'),
        el('div', { 'data-testid': 'tweetText' }, [], 'Must read article on AI performance:'),
        el('div', { 'data-testid': 'card.wrapper' }, [
          el('div', { 'dir': 'auto' }, [], 'Scaling Laws for LLM Inference'),
          el('div', { 'dir': 'auto' }, [], 'Empirical evaluation of latency vs throughput across clusters'),
          el('span', { 'dir': 'auto' }, [], 'research.google/pubs/inference'),
        ]),
      ]);

      const ctx = setupContextApi();
      const details = ctx.extractTweetDetails(article);

      expect(details.card).toBeDefined();
      expect(details.card.title).toBe('Scaling Laws for LLM Inference');
      expect(details.card.description).toBe('Empirical evaluation of latency vs throughput across clusters');
      expect(details.card.domain).toBe('research.google/pubs/inference');

      const formatted = ctx.formatSingleTweetDetails(details);
      expect(formatted).toContain('【网页链接/卡片】:');
      expect(formatted).toContain('- 标题: "Scaling Laws for LLM Inference"');
      expect(formatted).toContain('- 摘要: "Empirical evaluation of latency vs throughput across clusters"');
      expect(formatted).toContain('- 来源域名: research.google/pubs/inference');
    });

    it('distinguishes quoted tweet from the main tweet text', () => {
      const quoteBlock = el('div', { 'role': 'link' }, [
        el('div', { 'data-testid': 'User-Name' }, [], '@original_poster'),
        el('div', { 'data-testid': 'tweetText' }, [], 'We believe GPU prices will halve next year.'),
        el('div', { 'data-testid': 'tweetPhoto' }, [
          el('img', { alt: 'Price projection chart', src: 'https://chart.png' }),
        ]),
      ]);

      const article = el('article', { 'data-testid': 'tweet', 'data-xvm-tweet-id': '2004' }, [
        el('div', { 'data-testid': 'User-Name' }, [], '@commentator'),
        el('div', { 'data-testid': 'tweetText' }, [], 'Hard disagree with this thesis.'),
        quoteBlock,
      ]);

      const ctx = setupContextApi();
      const details = ctx.extractTweetDetails(article);

      // Outer tweet must not absorb the inner quote text
      expect(details.authorHandle).toBe('@commentator');
      expect(details.text).toBe('Hard disagree with this thesis.');

      // Quoted tweet is cleanly isolated
      expect(details.quoted).toBeDefined();
      expect(details.quoted.author).toBe('@original_poster');
      expect(details.quoted.text).toBe('We believe GPU prices will halve next year.');
      expect(details.quoted.images).toEqual(['Price projection chart']);

      const formatted = ctx.formatSingleTweetDetails(details);
      expect(formatted).toContain('【正文】:\nHard disagree with this thesis.');
      expect(formatted).toContain('【引用推文】(@original_poster):');
      expect(formatted).toContain('"We believe GPU prices will halve next year."');
      expect(formatted).toContain('[引用推文配图说明: Price projection chart]');
    });
  });

  describe('Multi-turn conversation thread extraction (循环对话)', () => {
    it('structures a 2-turn conversation thread with root post and target reply', () => {
      const store = new Map();
      store.set('101', {
        id: '101',
        screenName: 'founder',
        text: 'Announcing our v2.0 release with 5x speedups.',
        inReplyToStatusId: '',
      });

      const replyArticle = el('article', { 'data-testid': 'tweet', 'data-xvm-tweet-id': '102' }, [
        el('div', { 'data-testid': 'User-Name' }, [], '@user_feedback'),
        el('div', { 'data-testid': 'tweetText' }, [], 'Does this support ARM64 on Linux?'),
      ]);

      store.set('102', {
        id: '102',
        screenName: 'user_feedback',
        text: 'Does this support ARM64 on Linux?',
        inReplyToStatusId: '101',
      });

      const ctx = setupContextApi(store);
      const conversationContext = ctx.getComprehensiveConversationContext(replyArticle);

      expect(conversationContext).toContain('【讨论背景 · 原推文】');
      expect(conversationContext).toContain('@founder');
      expect(conversationContext).toContain('Announcing our v2.0 release with 5x speedups.');
      expect(conversationContext).toContain('【当前回复目标】');
      expect(conversationContext).toContain('@user_feedback');
      expect(conversationContext).toContain('Does this support ARM64 on Linux?');
    });

    it('structures a deep multi-turn thread (循环对话 3+ turns) in chronological dialogue order', () => {
      const store = new Map();
      // Root post: Turn 1
      store.set('t1', {
        id: 't1',
        screenName: 'author_root',
        text: 'Should startups focus on profitability from day 1?',
        inReplyToStatusId: '',
      });
      // Intermediate reply 1: Turn 2
      store.set('t2', {
        id: 't2',
        screenName: 'vc_investor',
        text: 'Growth is king early on. Profitability comes at scale.',
        inReplyToStatusId: 't1',
        inReplyToScreenName: 'author_root',
      });
      // Intermediate reply 2: Turn 3
      store.set('t3', {
        id: 't3',
        screenName: 'bootstrapper',
        text: 'Not in this high interest rate environment. Cash flow is oxygen.',
        inReplyToStatusId: 't2',
        inReplyToScreenName: 'vc_investor',
      });
      // Target reply: Turn 4
      const targetArticle = el('article', { 'data-testid': 'tweet', 'data-xvm-tweet-id': 't4' }, [
        el('div', { 'data-testid': 'User-Name' }, [], '@engineer_founder'),
        el('div', { 'data-testid': 'tweetText' }, [], 'We hit profitability in month 3, and it gave us unlimited runway.'),
      ]);
      store.set('t4', {
        id: 't4',
        screenName: 'engineer_founder',
        text: 'We hit profitability in month 3, and it gave us unlimited runway.',
        inReplyToStatusId: 't3',
        inReplyToScreenName: 'bootstrapper',
      });

      const ctx = setupContextApi(store);
      const conversationContext = ctx.getComprehensiveConversationContext(targetArticle);

      expect(conversationContext).toContain('【讨论背景 · 顶层原推】');
      expect(conversationContext).toContain('@author_root');
      expect(conversationContext).toContain('Should startups focus on profitability from day 1?');

      expect(conversationContext).toContain('【讨论脉络 · 前序对话】');
      expect(conversationContext).toContain('- @vc_investor (回复 @author_root): "Growth is king early on. Profitability comes at scale."');
      expect(conversationContext).toContain('- @bootstrapper (回复 @vc_investor): "Not in this high interest rate environment. Cash flow is oxygen."');

      expect(conversationContext).toContain('【当前回复目标】');
      expect(conversationContext).toContain('@engineer_founder');
      expect(conversationContext).toContain('We hit profitability in month 3, and it gave us unlimited runway.');
    });
  });

  describe('End-to-End Prompt Assembly Integration', () => {
    it('substitutes multimodal and multi-turn context into [推文内容] template placeholder', () => {
      const store = new Map();
      store.set('p1', {
        id: 'p1',
        screenName: 'tech_lead',
        text: 'Migrated from REST to WebSockets. Latency dropped 70%.',
        mediaList: [{ type: 'photo', url: 'https://cdn.x.com/chart.png', altText: 'Latency comparison bar chart' }],
        cardInfo: { title: 'WebSockets at Scale', description: 'Architecture breakdown', domain: 'techblog.com' },
      });
      store.set('p2', {
        id: 'p2',
        screenName: 'backend_dev',
        text: 'How did you handle reconnection storms and server-side connection limits?',
        inReplyToStatusId: 'p1',
        inReplyToScreenName: 'tech_lead',
      });

      const replyArticle = el('article', { 'data-testid': 'tweet', 'data-xvm-tweet-id': 'p2' }, [
        el('div', { 'data-testid': 'User-Name' }, [], '@backend_dev'),
        el('div', { 'data-testid': 'tweetText' }, [], 'How did you handle reconnection storms and server-side connection limits?'),
      ]);

      const ctx = setupContextApi(store);
      const fullContext = ctx.getComprehensiveConversationContext(replyArticle);

      const template = '[推文内容]\n\n为我生成针对该推文的10条观点鲜明、切中痛点的中文评论：\n- 结合推文正文、配图说明与讨论上下文（如有），指出关键权衡（Trade-off）\n- 每条评论只包含可直接发布的评论正文，用代码块包裹。';
      const prompt = template.split('[推文内容]').join(fullContext);

      expect(prompt).toContain('【讨论背景 · 原推文】');
      expect(prompt).toContain('@tech_lead');
      expect(prompt).toContain('Latency comparison bar chart');
      expect(prompt).toContain('WebSockets at Scale');
      expect(prompt).toContain('【当前回复目标】');
      expect(prompt).toContain('@backend_dev');
      expect(prompt).toContain('reconnection storms');
      expect(prompt).toContain('代码块包裹');
    });
  });
});
