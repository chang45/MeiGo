import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderStatus } from '../entities/order.entity';

/**
 * 订单响应 DTO。
 */
export class OrderResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  orderNo!: string;

  @ApiProperty()
  merchantName!: string;

  @ApiProperty()
  customerName!: string;

  @ApiProperty()
  customerPhone!: string;

  @ApiProperty()
  deliveryAddress!: string;

  @ApiProperty()
  status!: OrderStatus;

  @ApiProperty()
  createTime!: Date;

  @ApiProperty({ nullable: true })
  acceptedAt!: Date | null;

  @ApiProperty({ nullable: true })
  deliveredAt!: Date | null;

  static from(entity: Order): OrderResponseDto {
    const dto = new OrderResponseDto();
    dto.id = entity.id;
    dto.orderNo = entity.orderNo;
    dto.merchantName = entity.merchantName;
    dto.customerName = entity.customerName;
    dto.customerPhone = entity.customerPhone;
    dto.deliveryAddress = entity.deliveryAddress;
    dto.status = entity.status;
    dto.createTime = entity.createTime;
    dto.acceptedAt = entity.acceptedAt;
    dto.deliveredAt = entity.deliveredAt;
    return dto;
  }
}
