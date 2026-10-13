import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * 商家审核的请求 DTO。
 */
export class ReviewMerchantDto {
  @ApiProperty({ description: '是否通过' })
  @IsBoolean({ message: 'approve 必须是布尔值' })
  approve!: boolean;

  @ApiPropertyOptional({ description: '驳回原因（驳回时填写）' })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: '驳回原因不能超过 200 个字符' })
  reason?: string;
}
