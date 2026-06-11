# CS IDOL

Counter-Strike 2 风格个人站点，基于 **Next.js 15 App Router** + **Tailwind CSS**，支持静态导出并部署到 **GitHub Pages**。

## 项目目录结构

```
CsIdol/
├── public/
│   └── .nojekyll              # 防止 GitHub Pages Jekyll 忽略 _next 目录
├── src/
│   ├── app/
│   │   ├── about/
│   │   │   └── page.jsx       # 个人简介页 /about/
│   │   ├── works/
│   │   │   └── page.jsx       # 作品页 /works/
│   │   ├── globals.css        # Tailwind + CS2 主题变量
│   │   ├── layout.jsx         # 根布局（客户端组件）
│   │   ├── not-found.jsx      # 404 页面
│   │   └── page.jsx           # 首页 /
│   └── components/
│       ├── Footer.jsx         # 页脚
│       ├── Navbar.jsx         # 全局导航栏
│       └── PageHeader.jsx     # 页面标题组件
├── .gitignore
├── jsconfig.json              # 路径别名 @/*
├── next.config.js             # 静态导出 / basePath / trailingSlash
├── package.json               # 脚本 & 依赖
├── postcss.config.mjs         # PostCSS + Tailwind v4
└── README.md
```

## 技术要点

| 配置项 | 说明 |
|--------|------|
| `output: "export"` | 生成纯静态 HTML，输出到 `out/` |
| `images.unoptimized: true` | 关闭 Next.js 图片优化（静态导出不支持） |
| `trailingSlash: true` | 路由带尾斜杠，GitHub Pages 子目录刷新不 404 |
| `public/.nojekyll` | 保留 `_next` 静态资源目录 |
| `basePath` | 通过环境变量适配 `username.github.io/仓库名/` |
| 全客户端组件 | 所有页面与布局均使用 `"use client"` |

## 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认 http://localhost:3000）
npm run dev
```

## 本地预览静态产物

```bash
# 普通静态构建（无 basePath，适合本地预览根路径）
npm run build

# 启动静态文件服务预览 out 目录
npm run preview
```

若需模拟 GitHub Pages 子路径部署：

```bash
npm run build:gh
npx serve out
# 访问 http://localhost:3000/CsIdol/
```

> **注意**：`build:gh` 脚本中 `NEXT_PUBLIC_BASE_PATH=/CsIdol` 需与你的 GitHub 仓库名一致。若仓库名不同，请修改 `package.json` 中 `build:gh` 和 `deploy` 脚本的路径。

## 部署到 GitHub Pages

### 前置条件

1. 在 GitHub 创建仓库（例如 `CsIdol`）
2. 仓库 **Settings → Pages → Build and deployment** 选择 **Deploy from a branch**
3. Branch 选择 `gh-pages`，文件夹选 `/ (root)`

### 一键部署

```bash
# 构建（含 basePath）并推送到 gh-pages 分支
npm run deploy
```

该命令等价于：

```bash
cross-env NEXT_PUBLIC_BASE_PATH=/CsIdol next build
gh-pages -d out -t true
```

`-t true` 会在部署分支自动添加 `.nojekyll`（项目中 public 目录也已包含）。

### 手动部署步骤

```bash
# 1. 修改 basePath 为你的仓库名后构建
npm run build:gh

# 2. 将 out 目录推送到 gh-pages 分支
npx gh-pages -d out -t true
```

### 访问地址

- 用户/组织页：`https://<username>.github.io/`（需将 basePath 设为空字符串）
- 项目页：`https://<username>.github.io/CsIdol/`

## 页面路由

| 路径 | 页面 |
|------|------|
| `/` | 首页 — CS2 风格 Hero + 数据面板 |
| `/about/` | 个人简介 — 玩家档案 & 技能矩阵 |
| `/works/` | 作品集 — 战术/创意/开发项目卡片 |

## 自定义

- **修改 CS2 配色**：编辑 `src/app/globals.css` 中的 `@theme` 变量
- **修改仓库名/basePath**：编辑 `package.json` 的 `build:gh` 与 `deploy` 脚本
- **添加页面**：在 `src/app/` 下新建目录和 `page.jsx`（记得加 `"use client"`），并在 `Navbar.jsx` 中添加导航项

## License

MIT
