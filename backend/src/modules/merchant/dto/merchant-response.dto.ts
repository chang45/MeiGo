import { ApiProperty } from '@nestjs/swagger';
import { Merchant, MerchantStatus } from '../entities/merchant.entity';

/**
 * 商家响应 DTO：隔离实体与对外契约。
 */
export class MerchantResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  contactName!: string;

  @ApiProperty()
  phone!: string;

  @ApiProperty()
  address!: string;

  @ApiProperty({ nullable: true })
  description!: string | null;

  @ApiProperty()
  status!: MerchantStatus;

  @ApiProperty({ nullable: true })
  rejectReason!: string | null;

  @ApiProperty({ nullable: true })
  reviewedAt!: Date | null;

  @ApiProperty()
  createTime!: Date;

  @ApiProperty()
  updateTime!: Date;

  static from(entity: Merchant): MerchantResponseDto {
    const dto = new MerchantResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.contactName = entity.contactName;
    dto.phone = entity.phone;
    dto.address = entity.address;
    dto.description = entity.description;
    dto.status = entity.status;
    dto.rejectReason = entity.rejectReason;
    dto.reviewedAt = entity.reviewedAt;
    dto.createTime = entity.createTime;
    dto.updateTime = entity.updateTime;
    return dto;
  }
}
