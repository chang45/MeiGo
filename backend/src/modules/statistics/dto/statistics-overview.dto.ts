import { ApiProperty } from '@nestjs/swagger';

/**
 * 平台统计概览响应 DTO。
 */
export class StatisticsOverviewDto {
  @ApiProperty({ description: '商家总数' })
  totalMerchants!: number;

  @ApiProperty({ description: '待审核商家数' })
  pendingMerchants!: number;

  @ApiProperty({ description: '已通过商家数' })
  approvedMerchants!: number;

  @ApiProperty({ description: '已驳回商家数' })
  rejectedMerchants!: number;

  @ApiProperty({ description: '分类总数' })
  totalCategories!: number;

  @ApiProperty({ description: '启用中的分类数' })
  enabledCategories!: number;

  @ApiProperty({ description: '今日订单数（订单模块接入后统计）' })
  todayOrders!: number;

  @ApiProperty({ description: '今日交易额（订单模块接入后统计）' })
  todayRevenue!: number;
}
