import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * 商家入驻申请的请求 DTO。
 */
export class ApplyMerchantDto {
  @ApiProperty({ description: '店铺名称' })
  @IsString()
  @IsNotEmpty({ message: '店铺名称不能为空' })
  @MaxLength(100, { message: '店铺名称不能超过 100 个字符' })
  name!: string;

  @ApiProperty({ description: '联系人' })
  @IsString()
  @IsNotEmpty({ message: '联系人不能为空' })
  @MaxLength(50, { message: '联系人不能超过 50 个字符' })
  contactName!: string;

  @ApiProperty({ description: '联系电话' })
  @IsString()
  @IsNotEmpty({ message: '联系电话不能为空' })
  @MaxLength(20, { message: '联系电话不能超过 20 个字符' })
  phone!: string;

  @ApiProperty({ description: '店铺地址' })
  @IsString()
  @IsNotEmpty({ message: '店铺地址不能为空' })
  @MaxLength(200, { message: '店铺地址不能超过 200 个字符' })
  address!: string;

  @ApiPropertyOptional({ description: '店铺简介' })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '店铺简介不能超过 500 个字符' })
  description?: string;
}
