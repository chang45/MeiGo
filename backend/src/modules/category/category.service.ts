import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CategoryRepository } from './category.repository';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

/**
 * 分类应用服务：用例编排 + 事务边界。
 */
@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly dataSource: DataSource,
  ) {}

  /** 创建分类，名称不可重复。 */
  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const existing = await this.categoryRepository.findByName(dto.name);
      if (existing) {
        throw new ConflictException('分类名称已存在');
      }
      const entity = this.categoryRepository.create(dto);
      const saved = await manager.save(entity);
      this.logger.log(`创建分类成功：${saved.name}`);
      return CategoryResponseDto.from(saved);
    });
  }

  /** 查询全部分类，按排序值升序返回。 */
  async findAll(): Promise<CategoryResponseDto[]> {
    const entities = await this.categoryRepository.findAll();
    return entities.map(CategoryResponseDto.from);
  }

  /** 更新分类信息。 */
  async update(id: number, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const entity = await this.categoryRepository.findOne(id);
      if (!entity) {
        throw new NotFoundException('分类不存在');
      }
      if (dto.name !== undefined && dto.name !== entity.name) {
        const duplicated = await this.categoryRepository.findByName(dto.name);
        if (duplicated && duplicated.id !== id) {
          throw new ConflictException('分类名称已存在');
        }
      }
      if (dto.name !== undefined) entity.name = dto.name;
      if (dto.icon !== undefined) entity.icon = dto.icon;
      if (dto.sort !== undefined) entity.sort = dto.sort;
      if (dto.enabled !== undefined) entity.enabled = dto.enabled;
      const saved = await manager.save(entity);
      return CategoryResponseDto.from(saved);
    });
  }

  /** 删除分类。 */
  async remove(id: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const entity = await this.categoryRepository.findOne(id);
      if (!entity) {
        throw new NotFoundException('分类不存在');
      }
      await manager.remove(entity);
    });
  }
}
