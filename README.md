# X 爆款雷达 (X Viral Radar)

[English](README.en.md)

在 X (Twitter) 时间线上实时显示每条推文的**曝光流速**（views/hour）、深度解析**爆款逻辑**、AI 辅助二创仿写，并附带强大的排行榜导出与高阶看图神器。

[![Version](https://img.shields.io/badge/version-v1.0.0-black)](https://github.com/zhaosj0315/x-viral-monitor/releases)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-success)](manifest.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Pure Open Source](https://img.shields.io/badge/100%25-Free%20%26%20Open-black)](#开源与免费声明)
[![Tests Passing](https://img.shields.io/badge/tests-394%20passed-brightgreen)](tests/)

> 采用 21Zhao 极简黑白高对比度 UI 设计，全功能 100% 开放，本地纯净运行，零数据收集。

---

## 核心功能亮点

| 功能 | 触发位置 | 详细说明 |
|---|---|---|
| **⚡ 实时流速徽章** | 时间线每条推文 | 实时显示每小时浏览量（views/h）与流速状态（🌱 正常 · 🚀 蹿升 · 🔥 爆款），悬停查看互动细节与综合爆帖指数 |
| **🧠 多模态 AI 爆款拆解** | 时间线操作栏 / 回复框 | 一键剖析推文为何能爆火，提炼选题切入点、Hook 钩子、情绪共鸣点，并自动生成 5 篇结构仿写推文草稿 |
| **💬 循环对话深度解析** | 评论区与多轮回复 | 自动解析多轮讨论脉络（Thread Ancestors）与引用推文（Quoted Tweets），将完整对话上下文送入 AI 进行针对性深度评论 |
| **📥 浮动热度榜与导出** | 页面右下角（可拖拽贴边） | 实时抓取屏幕内最高流速推文排行，支持点击定位跳转，支持**一键复制为 Markdown / JSON 表格**导入素材库 |
| **🖼️ 原生手势灯箱与长图阅读** | X 原生看图灯箱 | Mac 触控板捏合/双指平移缩放、双击全屏；超长推文长图自动纵向平滑滚动并自适应加载 4096px 超清原图 |
| **🛡️ 纯本地内容与流速过滤** | 回复区 / 时间线 | 本地拦截 spam / 色情 / 电报漏斗推广，按 views/min 阈值隐藏低质推文，不经过任何外部服务器 |
| **🤖 多大模型生态互通** | 设置面板 | 支持 Google Gemini 2.0 Flash、X 原生 Grok，或一键接入任意自定义 OpenAI 兼容协议大模型 API |
| **✨ 感谢星图** | 分享菜单 | 一键将转推与引用用户生成为粒子轨道动态可视化星图 |

---

## 开源与免费声明

本项目为 **100% 纯净开源软件**，遵循 MIT 协议。

- **全面剥离商业门槛**：所有流速过滤、榜单导出、多模态拆解、长图增强等进阶能力对所有用户完全开放，绝无任何订阅墙、License 激活或付费弹窗。
- **隐私至上 (Privacy First)**：所有网络指标拦截与上下文拼装均在用户浏览器本地完成，零埋点、零遥测、不收集并绝不上传任何用户隐私与浏览数据。

---

## 流速分级与爆帖指数

### 流速等级

| 图标 | 状态 | 流速 (views/h) | 含义 |
|:---:|:---:|:---:|:---|
| 🌱 | 正常 | < 1,000/h | 稳健曝光 |
| 🚀 | 蹿升 | 1,000 - 10,000/h | 正在起量，具备扩散潜力 |
| 🔥 | 爆款 | ≥ 10,000/h | 现象级热度推文 |

### 爆帖指数评分模型

综合评分 0-100，基于四个加权维度算法：

| 评估维度 | 权重占比 | 满分基准条件 |
|---|:---:|---|
| **流速表现** | 40% | ≥ 50,000 views/h |
| **互动转化率** | 25% | 互动率 ≥ 10% |
| **转发扩散比** | 20% | 转推 / 点赞 ≥ 50% |
| **收藏价值比** | 15% | 收藏 / 点赞 ≥ 30% |

---

## 安装与快速上手

### 1. 源码加载安装（推荐）

1. 克隆或下载本仓库源码至本地：
   ```bash
   git clone https://github.com/zhaosj0315/x-viral-monitor.git
   ```
2. 进入目录并安装依赖、执行构建：
   ```bash
   cd x-viral-monitor
   npm install
   npm run build:dist
   ```
3. 打开 Google Chrome 或 Edge 浏览器，访问 `chrome://extensions/`。
4. 在右上角开启 **开发者模式 (Developer mode)**。
5. 点击左上角 **加载已解压的扩展程序 (Load unpacked)**。
6. 选择本项目中的 `dist/` 目录即可完成安装。
7. 访问 [x.com](https://x.com) 即可立即体验！

### 2. 下载发行版 Release 压缩包

从 [GitHub Releases](https://github.com/zhaosj0315/x-viral-monitor/releases) 页面下载最新的 `x-viral-monitor-v1.0.0-*.zip`，解压后同样通过 `chrome://extensions/` 加载即可。

---

## 项目架构

```
├── _locales/                  # 多语言国际化（en / zh_CN / ja）
├── icons/                     # 21Zhao 极简黑白高分辨率图标
├── lib/                       # 核心拦截与解析底层库
│   ├── x-net-hook.js          # GraphQL / REST 请求捕获拦截
│   ├── grok-reply.js          # AI 提示词与回复流式驱动
│   ├── image-viewer.js        # 原生手势灯箱（Pinch/Pan/Zoom）
│   └── long-image-viewer.js   # 超清长图自适应纵向平滑阅读
├── store-assets/              # Chrome Web Store 商店高清水印图与规范文案
├── release/                   # 打包构建产物目录
├── scripts/                   # 自动化构建、规则同步与资产生成脚本
├── tests/                     # 完整自动化单元与集成测试套件 (Vitest)
├── bridge.js                  # 页面上下文与隔离世界通信桥
├── content.js                 # 核心内容注入脚本与多模态解析器
├── popup.html / popup.js      # 21Zhao 白纸黑字极简设置弹窗
├── styles.css                 # 现代高对比度黑白极简样式
└── manifest.json              # Chrome 扩展 Manifest V3 清单配置
```

---

## 本地开发与测试

```bash
# 运行完整自动化测试套件 (394 个用例)
npm test

# 构建适用于 Chrome 扩展的发布产物
npm run build:dist

# 打包 Chrome Web Store 上架 Zip 包
npm run package:store

# 仅同步安全与内容过滤规则
npm run sync:rules
```

---

## 许可证

本项目基于 [MIT 许可证](LICENSE) 开放开源。
