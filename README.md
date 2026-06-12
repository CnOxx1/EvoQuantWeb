# EvoQuant Web — 技术栈

## 项目概述

EvoQuant 是一个加密货币数据基础设施项目，本站点为其官网与内容管理系统（CMS）。支持 中文 / English / 日本語 三语言。

项目采用 **npm workspaces monorepo** 结构，`client` 和 `server` 为两个独立 package。

---

##前端

| 类别 | 技术 | 版本 | 用途 |
|---|---|---|---|
| 框架 | React | ^18.3 | UI 框架 |
| 构建 | Vite | ^6.0 | 开发/打包 |
| CSS | Tailwind CSS | ^4.0 | 原子化样式 + CSS 自定义属性主题切换（亮/暗） |
| 路由 | React Router DOM | ^6.26 | 客户端路由，admin 页面按需 lazy load |
| HTTP | Axios | ^1.7 | 请求客户端，内置 JWT 拦截器 |
| 国际化 | i18next + react-i18next | ^23 / ^15 | 静态翻译 JSON + 后端动态翻译双通道 |
| 富文本 | react-quill | ^2.0 | 管理员内容编辑 |
| 安全 | DOMPurify | ^3.1 | 渲染 HTML 前做 XSS 清洗 |
| 图标 | react-icons | ^5.3 | 图标库 |

**状态管理**: React Context（AuthContext / ThemeContext / SettingsContext），无 Redux。

**样式方案**: Tailwind v4 + `index.css` 中 CSS 自定义属性（`--bg-primary` / `--text-primary` 等），通过 `<html>` 上的 `.light` class 切换主题。

---

## 后端

| 类别 | 技术 | 版本 | 用途 |
|---|---|---|---|
| 框架 | Express | ^4.21 | Web 服务框架 |
| 数据库 | better-sqlite3 | ^11.6 | SQLite 同步驱动（WAL 模式） |
| 认证 | jsonwebtoken + bcryptjs | ^9.0 / ^2.4 | JWT Bearer Token（2h 过期）+ bcrypt 密码哈希（12 轮） |
| 安全头 | helmet | ^8.0 | CSP 等 HTTP 安全头 |
| 跨域 | cors | ^2.8 | CORS 配置 |
| 限流 | express-rate-limit | ^7.4 | 登录 5次/15min、联系表单 5次/时、通用 100次/分 |
| 校验 | express-validator | ^7.0 | 输入清洗与校验 |
| 上传 | multer | ^1.4 | 图片上传（仅图片格式，单文件 ≤5MB，UUID 重命名） |

**模块系统**: CommonJS（`require` / `module.exports`）。

**生产模式**: Express 直接 serve `client/dist/` 的 Vite 构建产物 + SPA fallback。

---

## 数据库

**SQLite**（文件型嵌入式数据库），共 10 张核心表：

| 表 | 用途 |
|---|---|
| `admin_users` | 管理员账户 |
| `pages` | CMS 页面（含三语言标题/meta） |
| `page_sections` | 页面内容区块（含三语言内容/图片） |
| `translations` | 动态翻译键值（lang + key UNIQUE） |
| `settings` | 站点设置（key-value） |
| `contact_submissions` | 联系表单提交 |
| `login_attempts` | 登录审计日志 |

---

## 国际化 (i18n)

- 静态翻译：`client/src/i18n/locales/{zh,en,ja}.json`（UI 字符串）
- 动态翻译：数据库 `translations` 表 + 管理后台 CRUD
- 页面内容：`pages` / `page_sections` 表中 `_zh` / `_en` / `_ja` 列变体
- 语言检测：localStorage (`evo-lang`) > 浏览器语言

---

## 开发 & 部署

| 类别 | 工具 |
|---|---|
| 包管理 | npm workspaces |
| 并行启动 | concurrently（client :5173 + server :3001） |
| 构建 | `vite build` → `client/dist/` |
| 部署 | 手动部署，Express 统一 serve API + 静态文件，无 Docker |

```
website/
├── package.json          # workspace root, concurrently dev script
├── .env / .env.example   # JWT_SECRET, ADMIN_PATH, PORT, NODE_ENV
├── client/               # React + Vite (type: module)
│   ├── src/
│   │   ├── api/          # Axios 实例 + 接口定义
│   │   ├── components/   # admin/ common/ layout/
│   │   ├── contexts/     # Auth / Theme / Settings
│   │   ├── hooks/        # usePageContent / useSectionContent
│   │   ├── i18n/         # i18next 配置 + locales/
│   │   ├── pages/        # 公开页面 + admin/ 管理后台
│   │   └── utils/        # constants / sanitize
│   └── vite.config.js
└── server/               # Express + better-sqlite3 (type: commonjs)
    ├── config/           # db.js (DDL) / env.js
    ├── data/             # database.sqlite + seed.js
    ├── middleware/        # auth / rateLimiter / validate / adminPathGuard
    ├── routes/           # auth / pages / sections / links / founders / partners / translations / settings / uploads / contact
    └── services/         # dbService / jwtService
```

---

## 安全措施

- **Admin 路径混淆**: 管理后台路径可通过环境变量 `ADMIN_PATH` 自定义，非常规 `/admin`
- **JWT**: 2 小时过期，Bearer Token 存储在 sessionStorage
- **CSP**: 通过 helmet 配置 Content-Security-Policy
- **限流**: 登录、联系表单、通用 API 分别设置限流策略
- **输入校验**: express-validator 对所有输入做 trim / escape / 类型校验
- **XSS**: DOMPurify 清洗富文本内容后再渲染
- **文件上传**: 仅允许图片类型，UUID 文件名，5MB 上限
- **密码**: bcryptjs 12 轮哈希
