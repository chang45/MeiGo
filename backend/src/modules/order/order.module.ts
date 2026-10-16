import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { RiderOrderController } from './rider-order.controller';

/**
 * 订单业务模块。
 */
@Module({
  imports: [TypeOrmModule.forFeature([Order]), AuthModule],
  controllers: [RiderOrderController],
  providers: [OrderService],
})
export class OrderModule {}
