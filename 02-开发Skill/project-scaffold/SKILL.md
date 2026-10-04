---
name: project-scaffold
description: 在"仿美团网站"项目中一键初始化或还原 NestJS + React 项目脚手架与工程规范。当用户要求"初始化项目、
  搭建脚手架、新建工程、还原目录结构、创建前后端骨架、准备开发环境"时使用。生成 NestJS 后端
  （modules + common + config + database + redis）与 React 前端目录，统一响应 { code, message, data }。
---

# 仿美团项目脚手架（NestJS + React）

## 适用场景

- 新成员或新环境从零还原后端 NestJS 模块结构与前端 React 目录
- 开始编码前初始化 `backend/`、`frontend/`、`docs/api/` 基础骨架
- 需要核对"开发架构视图 V2 源码目录结构"与真实目录是否一致

## 前置条件

- 已确认技术栈：NestJS 10 + TypeScript + TypeORM + PostgreSQL + Redis + BullMQ；React 18 + Vite + TypeScript + Ant Design
- 已确认后端业务模块统一放在 `backend/src/modules/<功能模块>/` 下

## 执行步骤

1. 运行 `scripts/init-project.py`（默认把工程建到仓库根，即 `02-开发Skill` 的上一级）
2. 检查生成的目录树是否包含 `modules / common / config / database / redis` + 前端目录 + 文档目录
3. 补充 `backend/package.json`、`backend/.env.example`、`docker-compose.yml`、前端 `package.json`
4. 在 `common/` 放置统一响应拦截器与全局异常过滤器
5. 运行 `npm run build`（或 `pnpm build`）确认骨架可编译

## 本项目强制约束（违反即视为错误）

- 后端业务模块统一放在 `backend/src/modules/<功能模块>/`，模块内为 `controller / service / repository / entity / dto`
- 依赖方向单向：Controller → Service → Repository；跨模块只通过 `@Module` 的 `exports` 注入
- 禁止 Controller 直接调 Repository；禁止 Service 直接写原生 SQL；禁止跨模块相对路径直连
- 对外接口统一由全局拦截器包装为 `{ code, message, data }`
- 目录结构必须与《开发架构视图 V2》逐行一致，不一致时改文档或改代码
- 禁止把 `node_modules/`、`dist/`、`build/` 等构建产物纳入工程

## 输出物

- 完整目录骨架（后端 NestJS、前端 React、资源、数据库迁移目录）
- 根目录 `.gitignore`

## 自检清单

- [ ] `modules / common / config / database / redis` 五目录齐全
- [ ] 前端 `src` 下 `api / pages / components / store / router / utils` 齐全
- [ ] 无反向或跨模块相对路径依赖
- [ ] 能通过 `npm run build`
- [ ] 无构建产物入库

## 常见错误与反例

- 错误：把业务代码散落在 `src` 根目录而不是 `src/modules/<功能模块>/` → 与 V2 对不上
- 错误：Controller 直接注入 `Repository` → 破坏分层，业务无法复用
- 错误：跨模块用 `../order/order.service` 相对路径直连 → 应通过 `@Module` 的 `exports` + 构造注入
