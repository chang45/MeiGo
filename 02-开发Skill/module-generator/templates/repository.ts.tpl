import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { {{Entity}} } from './entities/{{entityKebab}}.entity';
import { Create{{ModuleName}}Dto } from './dto/create-{{moduleKebab}}.dto';

/**
 * {{ModuleName}} 仓储：只负责数据访问，禁止写业务规则。
 */
@Injectable()
export class {{ModuleName}}Repository {
  constructor(
    @InjectRepository({{Entity}})
    private readonly repo: Repository<{{Entity}}>,
  ) {}

  create(dto: Create{{ModuleName}}Dto): {{Entity}} {
    return this.repo.create(dto);
  }

  findOne(id: number): Promise<{{Entity}} | null> {
    return this.repo.findOneBy({ id });
  }
}
