# DS-Visualizer 技术文档

## 1. 项目概述

DS-Visualizer 是一个数据结构可视化教学平台，通过 SVG/Canvas 动画直观展示数组、链表、栈、队列、树、图等数据结构的操作过程。采用前后端分离架构，前端为 Vue3 SPA，后端为 Node.js/Express REST API，数据持久化到 MySQL。

---

## 2. 技术栈

| 层 | 技术 | 说明 |
| --- | --- | --- |
| 前端框架 | Vue 3 + TypeScript + Vite | Composition API |
| 路由 | Vue Router 4 | Hash 模式，适配 GitHub Pages |
| 状态管理 | Pinia | 用户登录状态 |
| UI 组件库 | Element Plus + Tailwind CSS v4 | 全局组件 + 工具类 |
| 可视化 | SVG + Canvas | SVG 用于交互结构，Canvas 用于高频渲染 |
| HTTP 客户端 | Axios | JWT 拦截器 + 统一错误处理 |
| 后端运行时 | Node.js + Express | 替代 Spring Boot（同语言，更轻量） |
| ORM | Prisma | 自动映射现有 MySQL 表 |
| 数据库 | MySQL 8.0 | 生产环境持久化 |
| 备选后端 | Spring Boot 3 + JPA | `backend/` 目录保留 |
| 认证 | JWT + BCrypt | Token 24h 过期，密码加密存储 |
| 离线能力 | localStorage | 收藏/历史记录离线可用 |
| 部署 | GitHub Pages + serveo | 前端静态托管 + 后端公网隧道 |

---

## 3. 项目结构

```
ds-visualizer-fullstack/
├── frontend/                       # Vue3 前端
│   └── src/
│       ├── views/                  # 12 个页面
│       │   ├── HomeView.vue
│       │   ├── ArrayView.vue
│       │   ├── LinkedListView.vue
│       │   ├── StackQueueView.vue
│       │   ├── SortView.vue
│       │   ├── TreeView.vue
│       │   ├── GraphView.vue
│       │   ├── LoginView.vue
│       │   ├── RegisterView.vue
│       │   ├── ProfileView.vue
│       │   ├── LearningCenter.vue
│       │   └── NotFoundView.vue
│       ├── components/             # 可复用组件
│       │   ├── layout/             # AppHeader / AppFooter
│       │   ├── array/              # ArraySvg
│       │   ├── linkedlist/         # LinkedListSvg
│       │   ├── tree/               # TreeSvg
│       │   └── graph/              # GraphSvg
│       ├── composables/            # 动画引擎 + 用户操作
│       │   ├── useAnimation.ts         # 排序 Canvas 动画
│       │   ├── useArrayPlayer.ts       # 数组操作动画
│       │   ├── useLLPlayer.ts          # 链表操作动画
│       │   ├── useTreePlayer.ts        # 树遍历动画
│       │   ├── useGraphPlayer.ts       # 图遍历动画
│       │   └── useUserActions.ts       # 收藏/历史（含离线）
│       ├── algorithms/             # 客户端排序算法（5 种）
│       ├── store/                  # Pinia user store
│       ├── router/                 # 路由 + 导航守卫
│       ├── api/                    # Axios 封装
│       ├── utils/                  # 工具函数
│       └── types/                  # TypeScript 类型
│
├── backend-node/                   # Node.js 后端（推荐）
│   ├── prisma/schema.prisma        # 数据库模型（7 表）
│   └── src/
│       ├── index.ts                # Express 入口（CORS + 路由挂载）
│       ├── middleware/auth.ts       # JWT 认证中间件
│       ├── routes/
│       │   ├── auth.ts             # 注册 + 登录
│       │   ├── algorithms.ts       # 排序算法 + 历史
│       │   └── userData.ts         # 历史/收藏/笔记/进度
│       └── engines/
│           └── sorting.ts          # 5 种排序引擎（纯 TS）
│
├── backend/                        # Spring Boot 后端（备选）
│   └── src/main/java/com/dsvisualizer/
│       ├── controller/             # 3 个 Controller
│       ├── service/                # 业务逻辑
│       ├── engine/                 # 排序引擎（Java）
│       ├── entity/                 # 7 个 JPA Entity
│       ├── repository/             # Spring Data JPA
│       ├── security/               # JWT + SecurityConfig
│       ├── dto/                    # 数据传输对象
│       └── exception/              # 全局异常处理
│
├── docs/                           # 文档
│   ├── TECHNICAL.md
│   └── REQUIREMENTS.md
├── diagram/                        # 架构 SVG 图
├── .github/workflows/              # CI/CD
│   ├── deploy.yml                  # GitHub Pages 自动部署
│   └── deploy-backend.yml          # Railway 自动部署
├── railway.json                    # Railway 配置
├── render.yaml                     # Render.com 配置
└── tunnel.bat                      # serveo 公网隧道脚本
```

---

## 4. 数据库设计

### 连接信息

```
类型: MySQL 8.0
主机: localhost:3306
数据库: ds_visualizer
用户: root
```

### 表结构（7 张）

#### users — 用户
| 字段 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| id | bigint | PK, AUTO_INCREMENT | 主键 |
| username | varchar(50) | UNIQUE, NOT NULL | 用户名 |
| password | varchar(255) | NOT NULL | BCrypt 加密 |
| email | varchar(100) | UNIQUE, NOT NULL | 邮箱 |
| avatar | varchar(500) | NULL | 头像 URL |
| created_at | datetime | NOT NULL | 注册时间 |

#### history — 操作历史
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | bigint PK | 主键 |
| user_id | bigint | 用户 ID |
| structure | varchar(50) | 数据结构名称（Array/Sorting/Tree 等） |
| operation | varchar(50) | 操作名称（push/pop/bubble 等） |
| created_at | datetime | 操作时间 |

#### favorites — 收藏
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | bigint PK | 主键 |
| user_id | bigint | 用户 ID |
| structure | varchar(50) | 收藏的数据结构 |
| created_at | datetime | 收藏时间 |

#### notes — 笔记
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | bigint PK | 主键 |
| user_id | bigint | 用户 ID |
| content | TEXT | 笔记内容 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

#### algorithms — 算法元数据（种子数据）
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | varchar PK | 算法 ID（bubble/selection 等） |
| name | varchar | 算法名称 |
| time_complexity | varchar | 时间复杂度 |
| space_complexity | varchar | 空间复杂度 |
| stable | bit | 是否稳定排序 |

#### execution_history — 排序执行记录
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | bigint PK | 主键 |
| algorithm_id | varchar | 算法 ID |
| input_size | int | 输入规模 |
| comparisons | int | 比较次数 |
| swaps | int | 交换次数 |
| time_ms | bigint | 耗时（毫秒） |
| created_at | datetime | 执行时间 |

#### learning_progress — 学习进度
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | bigint PK | 主键 |
| user_id | bigint | 用户 ID |
| algorithm_id | varchar | 算法 ID |
| completed_steps | int | 完成步骤数 |
| score | int | 得分 |
| finished_at | datetime | 完成时间 |

---

## 5. API 文档

### 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

### 接口列表（12 个）

| 方法 | 路径 | 认证 | 说明 |
| --- | --- | --- | --- |
| POST | `/api/register` | 否 | 注册用户 |
| POST | `/api/login` | 否 | 登录，返回 JWT |
| GET | `/api/algorithms` | 否 | 获取 5 个算法元信息 |
| POST | `/api/sort/{id}` | 否 | 运行排序，返回步骤序列 |
| GET | `/api/sort/history` | 否 | 查询排序执行历史 |
| GET | `/api/history` | JWT | 查询用户操作历史 |
| POST | `/api/history` | JWT | 记录用户操作 |
| GET | `/api/favorites` | JWT | 查询用户收藏 |
| POST | `/api/favorites` | JWT | 收藏/取消收藏（toggle） |
| GET | `/api/notes` | JWT | 查询用户笔记 |
| POST | `/api/notes` | JWT | 保存笔记 |
| GET | `/api/progress` | JWT | 查询学习进度 |
| POST | `/api/progress` | JWT | 记录学习进度 |

### 登录接口示例

请求：
```json
POST /api/login
{ "username": "test123", "password": "test123" }
```

响应：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOi...",
    "user": { "id": 1, "username": "test123", "avatar": "" }
  }
}
```

### 排序接口示例

请求：
```json
POST /api/sort/bubble
{ "array": [5, 3, 8, 1] }
```

响应：
```json
{
  "code": 200,
  "data": {
    "algorithm": "bubble",
    "steps": [
      { "array": [5,3,8,1], "compared": [0,1], "swapped": [-1,-1], "sorted": [], "comparisons": 1, "swaps": 0 },
      ...
    ],
    "stats": { "comparisons": 6, "swaps": 4, "timeMs": 0 }
  }
}
```

---

## 6. 前端架构

### 路由设计
| 路径 | 页面 | 认证 |
| --- | --- | --- |
| `/` | 首页 | 否 |
| `/array` | 数组可视化 | 否 |
| `/linked-list` | 链表可视化 | 否 |
| `/stack-queue` | 栈/队列可视化 | 否 |
| `/sort` | 排序算法 | 否 |
| `/tree` | 二叉树 | 否 |
| `/graph` | 图算法 | 否 |
| `/login` | 登录 | 游客 |
| `/register` | 注册 | 游客 |
| `/profile` | 个人中心 | JWT |
| `/learning` | 学习中心 | 否 |
| `/*` | 404 | 否 |

### 认证流程
```
1. 用户输入用户名/密码 → LoginView
2. POST /api/login → 后端返回 JWT + user info
3. userStore.login() → 写入 localStorage(token/username)
4. 路由守卫 → 检查 localStorage 决定跳转
5. Axios 拦截器 → 每个请求自动带 Authorization: Bearer <token>
6. 401 响应 → 清除 token，跳转登录页
```

### 离线数据
```
收藏 → toggleFavorite() → 写入 ds_favorites (localStorage) → 后台 POST /api/favorites
历史 → recordHistory()  → 写入 ds_history (localStorage)    → 后台 POST /api/history
个人中心 → 先读 localStorage → 后台 GET /api/* 覆盖
```

### 动画系统
每个可视化模块采用统一的动画模式：
1. 用户点击操作按钮
2. 生成动画步骤数组（每步包含数据快照 + 高亮状态 + 描述文字）
3. AnimationController/Player 逐帧回放
4. 支持播放/暂停/重置/速度调节/进度拖拽

---

## 7. 安全设计

| 措施 | 实现 |
| --- | --- |
| 密码加密 | BCrypt（Salt 10 轮） |
| Token 认证 | JWT HS384，24h 过期 |
| CORS | 允许特定源，生产开放 |
| CSRF | Stateless JWT，无 Cookie |
| XSS | Vue 默认转义 |
| SQL 注入 | Prisma 参数化查询 |

---

## 8. 启动方式

### 前端
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

### 后端（Node.js）
```bash
cd backend-node
npm install
npx prisma generate
npx tsx src/index.ts
# http://localhost:8080
```

### 后端（Spring Boot 备选）
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

### 公网部署
```bash
# 启动后端后，另开终端：
tunnel.bat
# 获取 serveo URL，设为 GitHub Actions 变量 VITE_API_URL
```

---

## 9. 测试账号

用户名：`test123`  
密码：`test123`
