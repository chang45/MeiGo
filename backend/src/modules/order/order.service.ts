import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { OrderResponseDto } from './dto/order-response.dto';
import { Order, OrderStatus } from './entities/order.entity';

/**
 * 订单应用服务：骑手接单与配送状态流转。
 */
@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  /** 待接订单：status = pending 且尚未被任何骑手领取。 */
  async findAvailable(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      where: { status: 'pending', riderId: IsNull() },
      order: { createTime: 'DESC' },
    });
    return orders.map(OrderResponseDto.from);
  }

  /** 我配送中的订单：accepted 或 delivering。 */
  async findMine(riderId: number): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      where: { riderId, status: In(['accepted', 'delivering']) },
      order: { acceptedAt: 'DESC' },
    });
    return orders.map(OrderResponseDto.from);
  }

  /** 我的配送记录：completed。 */
  async findHistory(riderId: number): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      where: { riderId, status: 'completed' },
      order: { deliveredAt: 'DESC' },
    });
    return orders.map(OrderResponseDto.from);
  }

  /** 接单：条件更新保证同一订单只能被一名骑手领取。 */
  async accept(id: number, riderId: number): Promise<OrderResponseDto> {
    const result = await this.orderRepository.update(
      { id, status: 'pending', riderId: IsNull() },
      { riderId, status: 'accepted', acceptedAt: new Date() },
    );
    if (!result.affected) {
      const existing = await this.orderRepository.findOneBy({ id });
      if (!existing) {
        throw new NotFoundException('订单不存在');
      }
      throw new ConflictException('订单已被其他骑手接单或已失效');
    }

    const order = await this.orderRepository.findOneByOrFail({ id });
    this.logger.log(`骑手 ${riderId} 接单 ${order.orderNo}`);
    return OrderResponseDto.from(order);
  }

  /** 配送状态流转：accepted → delivering → completed。 */
  async updateStatus(
    id: number,
    riderId: number,
    status: 'delivering' | 'completed',
  ): Promise<OrderResponseDto> {
    const fromStatus: OrderStatus = status === 'delivering' ? 'accepted' : 'delivering';
    const payload: Partial<Order> = { status };
    if (status === 'completed') {
      payload.deliveredAt = new Date();
    }

    const result = await this.orderRepository.update(
      { id, riderId, status: fromStatus },
      payload,
    );
    if (!result.affected) {
      const existing = await this.orderRepository.findOneBy({ id });
      if (!existing) {
        throw new NotFoundException('订单不存在');
      }
      if (existing.riderId !== riderId) {
        throw new ForbiddenException('这不是你的订单');
      }
      throw new BadRequestException('订单状态不允许此操作');
    }

    const order = await this.orderRepository.findOneByOrFail({ id });
    return OrderResponseDto.from(order);
  }
}
