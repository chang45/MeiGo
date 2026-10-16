import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

const ALLOWED_STATUS = ['delivering', 'completed'] as const;

/**
 * 骑手更新配送状态的请求 DTO。
 */
export class UpdateOrderStatusDto {
  @ApiProperty({ enum: ALLOWED_STATUS, example: 'delivering' })
  @IsIn(ALLOWED_STATUS, { message: '状态只能是 delivering 或 completed' })
  status!: 'delivering' | 'completed';
}
