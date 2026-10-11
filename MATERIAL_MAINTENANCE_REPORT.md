# 全流程材料维护报告 (Material Maintenance Report)

> **项目名称**：X 爆款雷达 (X Viral Radar)  
> **版本基准**：`v1.0.0` (里程碑独立初始化)  
> **维护日期**：2026-10-11  
> **审计状态**：通过 (PASS)  

---

## 1. 维护目标与执行范围

为确保本项目从原上游独立解耦后具备**生产级、干净、零冗余、高内聚**的开源代码库质量，按照全流程材料维护规范进行地毯式审计：
1. **死代码与外部营销网站彻底剥离**：清理上游私人遗留资产、历史临时文件、废弃脚本以及为个人营销而生的 `site/` 与 `docs/` 静态网页包；
2. **品牌与文档体系脱钩**：中英文说明、发版变更日志、商店上架元数据全面自洽，完全归入 `21Zhao / zhaosj0315`；
3. **测试覆盖与质量闸门**：确保 28 个测试套件、394 项自动化测试持续 100% 绿灯；
4. **单提交收敛**：响应用户指令，将所有维护产物合并压制为唯一的独立初始提交（Solitary Initial Commit）。

---

## 2. 过程性材料与死代码清理表

| 类别 | 文件路径 / 目录 | 清理原因与动作 |
|:---:|---|---|
| **旧作者营销官网源码** | `site/` | 原作者为推广其域名 (`xvm.icy-cat.com`) 及其他商业付费插件 (`xmdpaste.icy-cat.com`) 而建的整套静态网站源模板，与扩展功能解耦，已彻底删除。 |
| **旧作者预渲染静态页** | `docs/*.html`<br>`docs/zh/`, `docs/ja/`<br>`docs/icycat-uiux.css`<br>`docs/site.css`, `docs/sitemap.xml` | 包含大量旧作者外链、SEO Sitemap 与历史收费文案的预渲染页面，已全盘清理，仅保留纯技术架构设计与商店规范 Markdown。 |
| **技术文档索引建立** | `docs/README.md` | 重构技术文档索引，覆盖 ADR 架构决策、商店元数据、Userscript 对齐规范等核心技术资产。 |
| **死代码与一次性脚本** | `scripts/build-site.mjs`<br>`scripts/check-site.mjs`<br>`scripts/probe-authors.mjs`<br>`scripts/probe-sample.mjs` | 旧作者营销站构建脚本及硬编码 Windows 路径 (`D:/Downloads/...`) 的一次性探测脚本，全盘剔除。 |
| **私人遗留凭据** | `docs/b8a175044adf87af7f5ca8bc80e7545b.txt`<br>`docs/CNAME` | 上游原作者 IndexNow 搜索引擎验证密钥与私人域名解析，已清理。 |
| **过期版本草案** | `store-assets/store-listing-v1.7.0-draft.md` | 历史 v1.7.0 阶段的废弃草案，当前统一由 `store-assets/store-listing.md` 维护。 |
| **远程规则源脱钩** | `src/premium/license/isolated.js`<br>`src/premium/content-filter/popup-content-filter.js` | 彻底移除对上游原作者 GitHub 路径的远程规则引用，重定向至本仓库 `zhaosj0315/x-viral-monitor`。 |
| **油猴脚本元数据清理** | `userscript/*.user.js`<br>`userscript/README.md` | 剥离上游原作者声明与命名空间，对齐至 `21Zhao / zhaosj0315`，测试套件同步更新并通过。 |
| **测试套件引用脱钩** | `tests/premium-license-slice.test.js`<br>`tests/premium-popup-ui.test.js`<br>`tests/tweet-data-extraction.test.js` | 净化测试断言与 mock 路径中的旧作者痕迹，完全对齐 `21zhao.com` 与通用 mock。 |

---

## 3. 文档与材料地毯式审计结果

| 文档 / 材料文件 | 审计核查点 | 审计结论 |
|---|---|:---:|
| [README.md](README.md) | 21Zhao 白纸黑字极简 UI、多模态多轮拆解、零商业门槛开源声明、安装与开发指引 | **通过** (无失效外链与旧版付费描述) |
| [README.en.md](README.en.md) | 英文架构说明、Core Highlights、Zero Paywalls 声明、Installation Guide | **通过** (与中文版双向对齐) |
| [CHANGELOG.md](CHANGELOG.md) | `[1.0.0] - 2026-10-10` 独立初始化发布日志记录 | **通过** (版本链自洽) |
| [TESTING.md](TESTING.md) | 28 个测试套件、394 个自动化测试执行证据与覆盖矩阵 | **通过** (全量测试指标透明) |
| [docs/README.md](docs/README.md) | 架构决策 (ADR)、商店元数据与 Userscript 技术文档索引 | **通过** |
| [store-assets/store-listing.md](store-assets/store-listing.md) | 中英文 Chrome Web Store 商店上架文案、功能分点与分类标签 | **通过** (发布准备就绪) |
| [manifest.json](manifest.json) | Manifest V3 规范、版本号 `1.0.0`、多语言 `__MSG_extName__` 引用 | **通过** |
| [package.json](package.json) | 版本号 `1.0.0`、ESM 模块类型、移除冗余构建脚本 | **通过** |

---

## 4. 自动化测试回归与构建验证

在清理与文档落地后，执行完整回归校验：

1. **Vitest 测试套件**：
   ```bash
   npm test
   ```
   **结果**：`28 passed (28) | 394 passed (394) | 0 failed | 0 skipped`
2. **Chrome Web Store 产物打包**：
   ```bash
   npm run package:store
   ```
   **结果**：构建产物 `release/x-viral-monitor-v1.0.0-chrome-web-store.zip`（253KB）生成完毕，并同步更新至桌面。

---

## 5. 最终结论与发布状态

- **仓库健康度**：零无用历史、零死代码、零外部上游关联。
- **Git 提交历史**：严格遵循用户指令，将全流程材料维护成果完全合并进 **唯一的独立初始化发布提交 (`v1.0.0`)**。
