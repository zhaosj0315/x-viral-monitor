# Testing & Quality Assurance: X Viral Radar (X 爆款雷达)

> 本文档记录 X 爆款雷达 (X Viral Radar) v1.0.0 版本的全量自动化测试架构、测试套件与执行证据。

---

## 1. 测试框架与架构

- **测试运行器**：[Vitest](https://vitest.dev/) v1.6.0
- **环境**：Node.js v20+ / ESM
- **测试范围**：单元测试 (Unit Tests)、DOM 节点解析测试、GraphQL 网络拦截测试、多模态与多轮对话拼接测试、国际化与构建一致性校验。

---

## 2. 测试执行摘要 (Test Execution Summary)

```text
Test Files  28 passed (28)
     Tests  394 passed (394)
  Duration  ~520ms
```

全量 28 个测试文件、394 个自动化测试全部通过，无任何失败 (0 failed)、无任何跳过 (0 skipped)。

---

## 3. 测试套件列表与覆盖模块

| 序号 | 测试文件 | 测试用例数 | 覆盖核心能力 |
|:---:|---|:---:|---|
| 1 | `tests/tweet-context-multimodal.test.js` | 9 | 多模态图文提取、Quoted 引用推文隔离、循环多轮上下文祖先回溯、Prompt 占位符拼装 |
| 2 | `tests/popup-dashboard.test.js` | 81 | 极简仪表盘设置持久化、阈值切换、多语言响应、组件可见性 |
| 3 | `tests/premium-content-filter.test.js` | 52 | 本地垃圾内容过滤、Spam 规则匹配、白名单与黑名单机制 |
| 4 | `tests/grok-reply.test.js` | 27 | Grok 提示词模板切换、文章长文分流、回复生成流式拦截 |
| 5 | `tests/bookmark-timeline-inject.test.js` | 24 | 书签时间线注入、网络请求捕获与数据持久化 |
| 6 | `tests/premium-resolveTier.test.js` | 26 | 剥离 Pro 门槛、默认全部功能激活、权限放行 |
| 7 | `tests/premium-license-slice.test.js` | 18 | License 逻辑安全性隔离与非侵入式放行 |
| 8 | `tests/premium-gate-stub.test.js` | 18 | 运行时功能门禁无感知透传 |
| 9 | `tests/premium-popup-ui.test.js` | 14 | 弹窗设置 UI 极简黑白交互规范 |
| 10 | `tests/premium-rate-filter-popup.test.js` | 14 | 流速过滤阈值设置面板与双向同步 |
| 11 | `tests/bookmark-folder-menu.test.js` | 12 | 书签文件夹浮动菜单与交互 |
| 12 | `tests/leaderboard-edge-hide.test.js` | 11 | 浮动热度榜侧边贴靠、展开与拖拽边界 |
| 13 | `tests/back-scroll-restore.test.js` | 10 | 点击榜单推文跳转后的原位滚动恢复定位 |
| 14 | `tests/userscript-mobile.test.js` | 9 | 移动端 Safari Userscripts 兼容与 DOM Fallback 兜底 |
| 15 | `tests/tweet-data-extraction.test.js` | 7 | GraphQL API 响应指标解析（views/h, RT, Like, Bookmark） |
| 16 | `tests/x-net-hook-replay.test.js` | 7 | X 前端 fetch / XMLHttpRequest 底层请求拦截与回放 |
| 17 | `tests/iv-active-swipe.test.js` | 7 | 图片查看器滑动手势与边界阻尼 |
| 18 | `tests/build-dist-sync.test.js` | 6 | `dist/` 产物字节级同步与渠道标记验证 |
| 19 | `tests/image-viewer-gesture.test.js` | 6 | Mac 触控板捏合/双指平移/滚轮缩放原生长图手势 |
| 20 | `tests/userscript-debug.test.js` | 6 | 移动端调试脚本诊断指标与 Eruda 挂载 |
| 21 | `tests/grok-readiness.test.js` | 5 | Grok 登录态与就绪握手检测 |
| 22 | `tests/grok-article-template-migration.test.js` | 5 | 长文推文提示词模板动态迁移 |
| 23 | `tests/grok-prompt-normalize.test.js` | 5 | 提示词格式化与换行规范清洗 |
| 24 | `tests/x-client-transaction.test.js` | 5 | X 客户端事务与签名验证 |
| 25 | `tests/liv-iv-threshold-sync.test.js` | 4 | 长图纵向阅读阈值与宽高比判定同步 |
| 26 | `tests/share-menu-detect.test.js` | 3 | 推文操作栏分享菜单识别与入口注入 |
| 27 | `tests/ai-background-parser.test.js` | 2 | 后台异步解析任务调度 |
| 28 | `tests/popup-accordion.test.js` | 1 | 折叠面板交互行为 |

---

## 4. 自动化回归命令

在项目根目录下随时运行以下命令复现全部测试证据：

```bash
# 执行完整测试套件
npm test

# 监听模式运行
npm run test:watch
```
