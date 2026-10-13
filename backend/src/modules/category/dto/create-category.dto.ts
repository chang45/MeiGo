import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

/**
 * 创建分类的请求 DTO：参数校验只放在这里。
 */
export class CreateCategoryDto {
  @ApiProperty({ description: '分类名称' })
  @IsString()
  @IsNotEmpty({ message: '分类名称不能为空' })
  @MaxLength(50, { message: '分类名称不能超过 50 个字符' })
  name!: string;

  @ApiPropertyOptional({ description: '图标（emoji）' })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: '图标不能超过 20 个字符' })
  icon?: string;

  @ApiPropertyOptional({ description: '排序值，越小越靠前' })
  @IsOptional()
  @IsInt({ message: '排序值必须是整数' })
  @Min(0, { message: '排序值不能小于 0' })
  sort?: number;

  @ApiPropertyOptional({ description: '是否启用，默认 true' })
  @IsOptional()
  @IsBoolean({ message: 'enabled 必须是布尔值' })
  enabled?: boolean;
}
