---
name: module-generator
description: 在"仿美团网站"项目中按 NestJS 模块规范生成一个新的业务模块。当用户要求"新增 / 创建 / 添加 XX 功能、
  模块、接口"，或需要生成 Module、Controller、Service、Repository、Entity、DTO、TypeORM 迁移文件时使用。
  生成代码严格遵守 Controller→Service→Repository 单向依赖，跨模块只通过 @Module exports 注入，
  统一响应 { code, message, data }。
---

# 仿美团业务模块生成器（NestJS）

## 适用场景

- 新增一个业务模块（如"优惠券 coupon""订单 order""评价 review"）
- 为已有模块补充 Controller / Service / Repository / DTO / 迁移文件
- 需要保证新模块的命名、依赖方向、事务、校验、日志与既有代码完全一致

## 前置条件

- 已确认模块名（大驼峰，如 `Order`、`Coupon`）与所属业务含义
- 已在 `docs/api/openapi.yaml` 登记接口（或本次一并登记）
- 后端目录已按 `backend/src/modules/` 结构初始化（见 project-scaffold）

## 执行步骤

1. 读取 `templates/` 下的模板，按模块名渲染各文件骨架
2. 逐层填写：DTO 校验 → Controller 路由 → Service 事务与编排 → Repository 数据访问 → Entity → 迁移文件
3. 生成 TypeORM 迁移文件到 `backend/src/database/migrations/`
4. 运行 `scripts/check-layering.py backend/src` 校验依赖方向
5. 补充单元测试与 OpenAPI 增量

> 可用 `python scripts/generate-module.py <ModuleName> [表名]` 一次性生成骨架。

## 本项目强制约束（违反即视为错误）

- **禁止** Controller 直接依赖 Repository，业务必须委托 Service
- **禁止** Service 依赖 Controller；**禁止** Repository 依赖 Service
- **禁止** 跨业务模块相对路径直连，只能通过目标模块 `@Module` 的 `exports` 注入
- 事务只能在 Service 层用 `DataSource.transaction` / `EntityManager.transaction` 开启
- 参数校验放在 DTO（class-validator），Controller 全局开启 `ValidationPipe`
- 日志使用 NestJS `Logger`，禁止 `console.log`
- 统一响应由全局拦截器包装为 `{ code, message, data }`
- 命名：`XxxModule / XxxController / XxxService / XxxRepository / Xxx`，DTO 为 `CreateXxxDto / UpdateXxxDto / XxxResponseDto`
- 数据库迁移使用 TypeORM migration，放在 `backend/src/database/migrations/`

## 输出物

- 模块代码文件（Module、Controller、Service、Repository、Entity、DTO）
- TypeORM 迁移文件
- 单元测试文件与 OpenAPI 增量

## 自检清单

- [ ] `check-layering.py` 校验通过（无反向 / 跨模块依赖）
- [ ] Controller 只做路由、参数校验与鉴权，不写业务规则
- [ ] 事务只出现在 Service 层
- [ ] 每个 public 方法有 JSDoc
- [ ] 无硬编码密钥与魔法值
- [ ] 通过 `npm test` / `npm run build`

## 常见错误与反例

**错误 1：业务规则写在 Controller**

```typescript
// 错误
@Controller('order')
export class OrderController {
  constructor(private readonly orderRepo: OrderRepository) {} // 直接依赖 Repository

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    if (!dto.title || dto.title.length > 50) {
      throw new BadRequestException('标题不合法');
    }
    return this.orderRepo.save(dto); // 业务规则与数据访问都在 Controller
  }
}
```

```typescript
// 正确
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto); // 只做路由与参数校验
  }
}
```

业务规则应放在 Service / Entity，Controller 只负责路由、参数校验与鉴权。

**错误 2：事务边界放在 Controller 或 Repository**

事务必须与 Service 层用例对齐，用 `DataSource.transaction` 包裹完整用例，避免局部提交。

**错误 3：跨模块相对路径直连**

```typescript
// 错误：订单模块直接 import 用户模块内部文件
import { UserService } from '../../user/user.service';
```

应让 `UserModule` 在 `@Module({ exports: [UserService] })` 导出，再在 `OrderModule` 的 `imports` 中引入并构造注入。
