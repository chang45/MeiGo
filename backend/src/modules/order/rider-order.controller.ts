import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard, JwtPayload } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OrderResponseDto } from './dto/order-response.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderService } from './order.service';

/**
 * 骑手订单接入层：可接单、配送中、配送记录与状态流转。
 */
@ApiTags('骑手订单')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('rider')
@Controller('rider/orders')
export class RiderOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('available')
  @ApiOperation({ summary: '可接订单列表' })
  available(): Promise<OrderResponseDto[]> {
    return this.orderService.findAvailable();
  }

  @Get('mine')
  @ApiOperation({ summary: '我配送中的订单' })
  mine(@CurrentUser() user: JwtPayload): Promise<OrderResponseDto[]> {
    return this.orderService.findMine(user.sub);
  }

  @Get('history')
  @ApiOperation({ summary: '我的配送记录' })
  history(@CurrentUser() user: JwtPayload): Promise<OrderResponseDto[]> {
    return this.orderService.findHistory(user.sub);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: '接单' })
  accept(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ): Promise<OrderResponseDto> {
    return this.orderService.accept(id, user.sub);
  }

  @Post(':id/status')
  @ApiOperation({ summary: '更新配送状态（delivering / completed）' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.updateStatus(id, user.sub, dto.status);
  }
}
