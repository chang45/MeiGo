# Skill 使用记录（usage-log）

> 评分看的是反思，不是流水账。每条必须包含：AI 生成了什么 / 我改了什么 / 为什么。

| 日期 | 场景 | 使用的 Skill | AI 产出的问题 | 我的修正 | 对 Skill 的改进 |
|------|------|-------------|--------------|---------|----------------|
| 2026-10-04 | 初始化 NestJS + React 工程骨架 | project-scaffold | （待记录） | （待记录） | （待记录） |

<!-- 参考示例（正式提交时删除本注释）：
## 2026-04-12 新增"订单"模块
- 场景：需要新增订单模块（Module + Controller + Service + Repository + 迁移文件）
- 使用的 Skill：module-generator
- AI 初次产出：生成了 OrderController，但把标题长度校验写在 Controller 里，且直接注入 Repository
- 我的修正：把校验下沉到 DTO / Service，Controller 改为只依赖 Service
- 为什么：Controller 承担业务规则会导致规则无法复用；直接依赖 Repository 破坏依赖方向
- 对 Skill 的改进：在"强制约束"中补充校验位置规则，并在"常见错误"里加了该反例
-->
