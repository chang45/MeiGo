import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Create{{ModuleName}}Dto } from './dto/create-{{moduleKebab}}.dto';
import { {{ModuleName}}ResponseDto } from './dto/{{moduleKebab}}-response.dto';
import { {{Entity}} } from './entities/{{entityKebab}}.entity';
import { {{ModuleName}}Repository } from './{{moduleKebab}}.repository';

/**
 * {{ModuleName}} 应用服务：用例编排 + 事务边界。
 * 事务只能在 service 层通过 DataSource.transaction 开启。
 */
@Injectable()
export class {{ModuleName}}Service {
  constructor(
    private readonly {{moduleName}}Repository: {{ModuleName}}Repository,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: Create{{ModuleName}}Dto): Promise<{{ModuleName}}ResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const entity: {{Entity}} = this.{{moduleName}}Repository.create(dto);
      const saved = await manager.save(entity);
      return {{ModuleName}}ResponseDto.from(saved);
    });
  }

  async findOne(id: number): Promise<{{ModuleName}}ResponseDto> {
    const entity = await this.{{moduleName}}Repository.findOne(id);
    if (!entity) {
      throw new NotFoundException('{{ModuleName}}不存在');
    }
    return {{ModuleName}}ResponseDto.from(entity);
  }
}
