# 仿美团网站（Meigo）

一个前后端分离的美团式本地生活服务平台，面向校园场景，涵盖消费者、商家、骑手、平台管理员四类角色。项目采用 NestJS + React + PostgreSQL + Redis 构建，配套 Docker Compose 一键部署。

## 功能概览

目前已实现的功能模块：

- 用户认证与权限：注册（消费者 / 商家 / 骑手）、登录、JWT 鉴权、基于角色的访问控制（RBAC）
- 商家店铺：入驻申请、平台审核、一个商家只能注册一个店铺
- 骑手配送：待接单、接单、开始配送、确认送达，完整的订单状态流转
- 平台管理：商家审核、分类管理、平台数据统计

## 技术栈

- 后端：NestJS 10 + TypeORM + PostgreSQL 16 + Redis 7 + BullMQ
- 前端：React 18 + Vite + Ant Design 5 + Zustand
- 认证：JWT + bcrypt 密码哈希
- 部署：Docker / Docker Compose + Nginx

## 目录结构

```
├── backend/                 # NestJS 后端（API 前缀 /api，Swagger 位于 /api/docs）
│   ├── src/modules/auth/    # 认证与权限
│   ├── src/modules/category/# 分类管理
│   ├── src/modules/merchant/# 商家店铺
│   ├── src/modules/order/   # 订单与骑手配送
│   ├── src/modules/statistics/ # 平台统计
│   └── src/database/migrations/ # 数据库迁移
├── frontend/                # React 前端
├── docker-compose.yml       # 全栈一键部署
└── .env.example             # 环境变量模板
```

## 快速开始

### 方式一：Docker 一键启动（推荐）

前提：已安装 Docker 与 Docker Compose。

```bash
cp .env.example .env
# 编辑 .env，修改数据库密码和 JWT_SECRET
docker compose up -d --build
```

启动完成后：

- 网站首页：http://localhost
- 后端接口文档（Swagger）：http://localhost/api/docs

首次启动会自动执行数据库迁移，并写入演示账号和演示订单。

常用命令：

```bash
docker compose ps          # 查看容器状态
docker compose logs -f backend   # 查看后端日志
docker compose down        # 停止（保留数据）
```

### 方式二：本地开发

1. 启动数据库与 Redis：

```bash
cd backend
docker compose up -d      # 使用 backend/docker-compose.yml，只启动 PostgreSQL 和 Redis
```

2. 安装依赖并执行数据库迁移：

```bash
cd backend
npm install
npm run migration:run
```

3. 启动后端：

```bash
npm run start:dev         # 开发模式，热更新
# 或 npm run build && npm run start:prod
```

4. 另开一个终端启动前端：

```bash
cd frontend
npm install
npm run dev
```

访问地址：

- 前端页面：http://localhost:5173
- 后端接口：http://localhost:3000/api
- Swagger：http://localhost:3000/api/docs

前端开发服务器会把 `/api` 请求代理到 `http://localhost:3000`。

## 演示账号

数据库迁移会自动写入以下账号（密码见括号）：

- 消费者 consumer（123456）
- 商家 merchant（123456）
- 骑手 rider（123456）
- 平台管理员 admin（admin123）

注册接口只开放消费者、商家、骑手三种身份，管理员账号由平台分配。

## 接口概览

### 认证（无需登录）

- POST /api/auth/register：注册，role 可选 consumer / merchant / rider
- POST /api/auth/login：登录，返回 JWT

### 认证（需要登录）

- GET /api/auth/me：获取当前登录用户

### 商家（需要 merchant 角色）

- POST /api/merchants/apply：提交 / 重新提交店铺申请
- GET /api/merchants/me：查询当前商家的店铺

### 骑手（需要 rider 角色）

- GET /api/rider/orders/available：待接订单
- GET /api/rider/orders/mine：我配送中的订单
- GET /api/rider/orders/history：我的配送记录
- POST /api/rider/orders/:id/accept：接单
- POST /api/rider/orders/:id/status：更新配送状态（delivering / completed）

### 平台管理（接口已提供，鉴权可按需补充）

- GET /api/admin/statistics/overview：平台统计概览
- GET /api/admin/merchants：商家列表，POST /api/admin/merchants/:id/review：审核
- 分类增删改查：/api/admin/categories

除登录注册外，需要鉴权的接口在请求头带上 `Authorization: Bearer <token>`。

## 订单状态机

```
pending(待接单) → accepted(已接单) → delivering(配送中) → completed(已送达)
```

骑手操作对应状态流转：

- 接单：pending → accepted
- 开始配送：accepted → delivering
- 确认送达：delivering → completed

接单接口使用条件更新，同一订单只会被一名骑手领取，避免重复接单。

## 一个商家只能一个店铺

店铺表通过 `owner_id` 建立唯一索引，并在业务层约束：

- 店铺处于审核中（pending）或已通过（approved）时，不能重复提交
- 被驳回（rejected）后可以修改并重新提交，复用同一条记录，保证一名商家始终只有一家店铺

## 部署上线

任务书要求提供“公网或校园网可访问地址 + 分角色测试账号”。不是必须买服务器，可选方案：

1. 内网穿透：本地 `docker compose up -d` 后，用 cpolar / 花生壳 / ngrok / frp 把 80 端口映射成公网地址，成本最低
2. 校园网服务器：向老师或实验室申请
3. 云服务器：轻量应用服务器（2 核 2G 起步，2 核 4G 更从容），绑定域名和 HTTPS 可拿部署加分项

部署到云服务器的步骤：

```bash
# 服务器上安装 Docker
curl -fsSL https://get.docker.com | sh

# 上传项目后，在项目目录执行
cp .env.example .env
# 编辑 .env：修改数据库密码与 JWT_SECRET
docker compose up -d --build
```

最后在云控制台安全组放行 TCP 80 端口，访问 `http://服务器公网IP` 验证。

## 常见问题

- 启动报 `EADDRINUSE ... :::3000`：3000 端口已被另一个后端进程占用，先停掉旧进程再启动，或修改 `PORT` 环境变量。
- 接口返回 404（Cannot GET/POST ...）：多半是后端进程还在跑旧代码，停止后重新执行 `npm run start:prod`（或 `npm run start:dev`）。
- 登录报“关系 users 不存在”：数据库迁移没执行，在 backend 目录运行 `npm run migration:run`。
- 数据库密码默认值不安全：上线前务必修改 `.env` 中的 `DB_PASSWORD` 和 `JWT_SECRET`。
