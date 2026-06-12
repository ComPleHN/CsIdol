# CS IDOL

Counter-Strike 2 **职业选手个人展示网站**，基于 Next.js 15 App Router + TypeScript + Tailwind CSS + Shadcn/ui，电竞风深色主题，数据全部来自本地 JSON。

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 15 App Router | 路由与静态导出 |
| TypeScript | 类型安全 |
| Tailwind CSS v4 | 样式 |
| Shadcn/ui | Button、Card、Badge、Dialog 等 |
| Lucide Icons | 图标 |
| Recharts | 地图胜率柱状图、综合雷达图 |

## 目录结构

```
src/app/
├── data/                 # 本地静态 JSON
│   ├── player.json       # 选手信息 + 荣誉 + 图集
│   ├── matches.json      # 比赛记录
│   ├── stats.json        # 统计数据
│   └── index.ts          # 数据导出入口
├── components/           # 公共组件
│   ├── ui/               # Shadcn 基础组件
│   ├── Navbar.tsx
│   ├── StatCard.tsx
│   ├── MatchCard.tsx
│   ├── MapWinRateChart.tsx
│   ├── PlayerRadarChart.tsx
│   ├── ImageGallery.tsx
│   └── ImagePreviewDialog.tsx
├── competitions/page.tsx # 赛事页
├── stats/page.tsx        # 数据统计页
├── gallery/page.tsx      # 图集页
├── page.tsx              # 首页
├── layout.tsx
└── types/index.ts

public/images/            # 图片资源（头像、图集）
```

## 页面路由

| 路径 | 说明 |
|------|------|
| `/` | 选手总览：头像、档案、荣誉墙 |
| `/competitions/` | 赛事列表，支持 Tier 标签筛选 |
| `/stats/` | Rating/KD/ADR 等数据卡片 + 图表 |
| `/gallery/` | 图集网格，点击弹窗预览与翻页 |
| `/admin/` | 本地数据管理（开发环境写入 JSON 文件） |

## 本地开发

```bash
npm install
npm run dev      # 同时启动 Next.js + 本地 data-api（:3456）
npm run build    # 静态导出到 out/
npm run preview  # 预览 out/
```

`npm run dev` 会自动启动 `scripts/data-api.mjs`，Admin 页面（`/admin/`）可通过表单直接保存到 `src/app/data/*.json`。

单独启动数据 API：`npm run data-api`

## Admin 数据管理

访问 **http://localhost:3000/admin/**（需 `npm run dev`）。

| 标签 | 对应文件 | 功能 |
|------|----------|------|
| 选手 | player.json | 基础信息、荣誉、图集 |
| 比赛 | matches.json | 增删改比赛与地图 |
| 统计 | stats.json | 综合数据、地图、雷达图 |
| JSON | 全部 | 原始 JSON 编辑 |

> 静态部署（GitHub Pages）不含 data-api，Admin 仅本地开发可用。线上数据请在本地编辑后重新 `npm run build` 部署。

可选鉴权：在 `.env.local` 设置 `ADMIN_TOKEN=你的密钥`，请求需带 `Authorization: Bearer <token>`。

## 修改数据

编辑 `src/app/data/` 下三个 JSON 文件即可，**无需任何 API**：

- **player.json** — 昵称、真名、国籍、战队、位置、简介、荣誉、图集
- **matches.json** — 日期、赛事、对手、比分、地图、赛果、标签
- **stats.json** — overview 综合数据、maps 地图统计、radar 雷达维度

图片放入 `public/images/`，在 JSON 中用 `/images/...` 路径引用。

CS 竞技地图代表图已内置在 `public/images/maps/`（Mirage、Inferno、Dust2、Nuke、Ancient、Anubis、Train、Vertigo、Overpass），来源为 CS2 官方游戏资源社区镜像 [MurkyYT/cs2-map-icons](https://github.com/MurkyYT/cs2-map-icons)。

## 部署

```bash
npm run build:gh   # GitHub Pages（含 basePath）
npm run deploy     # 推送到 gh-pages 分支
```

## License

MIT
