# X Viral Radar

[中文说明](README.md)

Chrome extension that displays real-time **impression velocity** (views/hour), conducts in-depth **viral breakdown analysis**, powers AI-assisted content remixing, exports live leaderboards to Markdown, and provides an enhanced image reader on X (Twitter).

[![Version](https://img.shields.io/badge/version-v1.0.0-black)](https://github.com/zhaosj0315/x-viral-monitor/releases)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-success)](manifest.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Pure Open Source](https://img.shields.io/badge/100%25-Free%20%26%20Open-black)](#open-source--free-declaration)
[![Tests Passing](https://img.shields.io/badge/tests-394%20passed-brightgreen)](tests/)

> Designed with 21Zhao minimalist monochrome high-contrast aesthetic. 100% free and open source, fully unlocked, running locally with zero tracking.

---

## Key Highlights

| Feature | Placement | Description |
|---|---|---|
| **⚡ Real-Time Velocity Badges** | Every tweet on timeline | Displays dynamic views/hour metrics and heat tiers (🌱 Normal · 🚀 Trending · 🔥 Viral). Hover tooltip reveals detailed interactions and composite Viral Score. |
| **🧠 Multimodal AI Viral Breakdown** | Action bar / reply composer | Analyzes what made a tweet go viral—core hooks, emotional drivers, and pacing—then remixes structural patterns into 5 high-converting drafts. |
| **💬 Multi-Turn Conversation Thread Parsing** | Reply sections | Reconstructs complete dialogue ancestors and quoted tweets, feeding deep context into LLMs for sharp, context-aware commentary. |
| **📥 Floating Leaderboard & Export** | Bottom-right (draggable / dockable) | Ranks fastest-growing tweets currently on screen. Click to jump directly; **1-click export to Markdown / JSON tables** for Obsidian, Notion, or local databases. |
| **🖼️ Enhanced Gesture Lightbox & Long Screenshots** | Native X lightbox | Trackpad pinch/pan zoom, double-click fullscreen. Tall screenshots scroll vertically with crystal clear 4096px resolution without compression. |
| **🛡️ Local Content & Velocity Filtering** | Replies / Timeline | Filters spam, adult content, and Telegram funnel replies locally. Hides low-velocity noise based on views/min thresholds without pinging external servers. |
| **🤖 Multi-LLM Ecosystem** | Settings panel | Seamlessly integrates Google Gemini 2.0 Flash, native X Grok, or custom OpenAI-compatible endpoints. |
| **✨ Thank-You Star Chart** | Share menu | Visualizes retweeters and quoters as an animated celestial particle orbit map. |

---

## Open Source & Free Declaration

This project is **100% free and open-source software** under the MIT license.

- **Zero Paywalls**: All advanced features—velocity filters, leaderboard export, multimodal analysis, and lightbox reading—are completely unlocked for all users. No licenses, subscriptions, or activation keys required.
- **Privacy by Design**: All timeline metrics and prompt assemblies are computed locally inside your browser session. Zero telemetry, zero analytics, zero data collection.

---

## Velocity Tiers & Viral Score

### Velocity Tiers

| Icon | Tier | Velocity (views/h) | Meaning |
|:---:|:---:|:---:|:---|
| 🌱 | Normal | < 1,000/h | Steady baseline impression |
| 🚀 | Trending | 1,000 - 10,000/h | Rapidly gaining momentum |
| 🔥 | Viral | ≥ 10,000/h | Viral sensation |

### Composite Viral Score Algorithm

Score from 0 to 100 based on weighted metrics:

| Metric Dimension | Weight | Benchmark for 100% |
|---|:---:|---|
| **Velocity Performance** | 40% | ≥ 50,000 views/h |
| **Engagement Rate** | 25% | Engagement rate ≥ 10% |
| **Retweet Ratio** | 20% | Retweets / Likes ≥ 50% |
| **Bookmark Value Ratio** | 15% | Bookmarks / Likes ≥ 30% |

---

## Installation & Getting Started

### 1. Load from Source (Recommended)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/zhaosj0315/x-viral-monitor.git
   ```
2. Install dependencies and build the extension distribution:
   ```bash
   cd x-viral-monitor
   npm install
   npm run build:dist
   ```
3. Open Google Chrome or Microsoft Edge, and navigate to `chrome://extensions/`.
4. Enable **Developer mode** in the top right corner.
5. Click **Load unpacked** in the top left corner.
6. Select the `dist/` directory inside this repository.
7. Visit [x.com](https://x.com) to start using X Viral Radar!

### 2. Download Pre-Built Release

Download the pre-packaged zip from [GitHub Releases](https://github.com/zhaosj0315/x-viral-monitor/releases), extract it, and load it via `chrome://extensions/`.

---

## Development & Testing

```bash
# Run complete test suite (394 tests across 28 suites)
npm test

# Build extension into dist/
npm run build:dist

# Package Chrome Web Store submission zip
npm run package:store

# Sync content filtering rules
npm run sync:rules
```

---

## License

Released under the [MIT License](LICENSE).
