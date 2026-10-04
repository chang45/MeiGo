# 02-开发Skill：仿美团网站 AI 开发规范包

本包是《软件体系架构》大作业"开发用 AI Skill"交付物，用于把"仿美团网站"项目的架构约束固化为 AI 可执行的规则，防止 AI 生成破坏模块边界与规范的代码。

## 技术栈与总体约定

- 后端：NestJS 10 + TypeScript + TypeORM + PostgreSQL
- 缓存与队列：Redis（缓存）+ BullMQ（异步任务 / 订单超时等）
- 前端：React 18 + Vite + TypeScript + Ant Design + Zustand + React Router
- 后端模块结构：`src/modules/<功能模块>/`，模块内 `controller / service / repository / entity / dto`
- 依赖方向：Controller → Service → Repository；跨模块只通过 `@Module` 的 `exports` 注入
- 统一响应：全局拦截器包装为 `{ code, message, data }`
- 统一异常：全局异常过滤器 + `HttpException`
- API 文档：`@nestjs/swagger`，同步导出 `docs/api/openapi.yaml`

## Skill 清单

| Skill | 目录 | 触发场景 |
|-------|------|---------|
| 项目脚手架 | project-scaffold | 初始化 / 还原 NestJS + React 工程结构 |
| 业务模块生成 | module-generator | 新增 / 创建 XX 功能、模块、接口 |
| 架构文档同步 | arch-doc-sync | 更新架构文档、扫描模块 / 接口清单 |

## 使用方式

1. 初始化工程：`python project-scaffold/scripts/init-project.py`
2. 新增模块：`python module-generator/scripts/generate-module.py <ModuleName>`，再运行 `python module-generator/scripts/check-layering.py` 校验
3. 同步文档：`python arch-doc-sync/scripts/scan-structure.py backend/src`

## 与开发视图的对应关系

| 开发视图条目 | 对应本包内容 |
|-------------|-------------|
| V2 源码目录结构 | `project-scaffold` 生成的目录 + `module-generator` 生成的模块代码 |
| V7 编码规范与质量门禁 | 各 `SKILL.md` 的"本项目强制约束"章节 |
| V10 AI 辅助开发方案 | 本包整体 + `usage-log.md` |

## 使用证据

见 `usage-log.md`（要求 ≥5 次真实使用与反思）。
