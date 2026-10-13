import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

/**
 * 分类仓储：只负责数据访问，禁止写业务规则。
 */
@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  create(dto: CreateCategoryDto): Category {
    return this.repo.create({ ...dto, sort: dto.sort ?? 0, enabled: dto.enabled ?? true });
  }

  findAll(): Promise<Category[]> {
    return this.repo.find({ order: { sort: 'ASC', id: 'ASC' } });
  }

  findOne(id: number): Promise<Category | null> {
    return this.repo.findOneBy({ id });
  }

  findByName(name: string): Promise<Category | null> {
    return this.repo.findOneBy({ name });
  }
}
