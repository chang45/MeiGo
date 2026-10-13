import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';

/**
 * 分类响应 DTO：隔离实体与对外契约。
 */
export class CategoryResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty({ nullable: true })
  icon!: string | null;

  @ApiProperty()
  sort!: number;

  @ApiProperty()
  enabled!: boolean;

  @ApiProperty()
  createTime!: Date;

  @ApiProperty()
  updateTime!: Date;

  static from(entity: Category): CategoryResponseDto {
    const dto = new CategoryResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.icon = entity.icon;
    dto.sort = entity.sort;
    dto.enabled = entity.enabled;
    dto.createTime = entity.createTime;
    dto.updateTime = entity.updateTime;
    return dto;
  }
}
