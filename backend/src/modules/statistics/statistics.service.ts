import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { StatisticsOverviewDto } from './dto/statistics-overview.dto';

interface MerchantCountRow {
  status: string;
  count: string;
}

interface CountRow {
  count: string;
}

/**
 * 平台统计应用服务：聚合商家与分类数据。
 */
@Injectable()
export class StatisticsService {
  private readonly logger = new Logger(StatisticsService.name);

  constructor(private readonly dataSource: DataSource) {}

  /** 平台统计概览，订单类指标在订单模块接入后补充。 */
  async getOverview(): Promise<StatisticsOverviewDto> {
    const merchantRows = (await this.dataSource.query(
      'SELECT status, COUNT(*) AS count FROM merchant GROUP BY status',
    )) as MerchantCountRow[];

    const byStatus: Record<string, number> = { pending: 0, approved: 0, rejected: 0 };
    for (const row of merchantRows) {
      if (row.status in byStatus) {
        byStatus[row.status] = Number(row.count);
      }
    }

    const totalCategories = Number(
      ((await this.dataSource.query('SELECT COUNT(*) AS count FROM category')) as CountRow[])[0].count,
    );
    const enabledCategories = Number(
      ((await this.dataSource.query(
        'SELECT COUNT(*) AS count FROM category WHERE enabled = true',
      )) as CountRow[])[0].count,
    );

    this.logger.log('平台统计概览已生成');
    return {
      totalMerchants: byStatus.pending + byStatus.approved + byStatus.rejected,
      pendingMerchants: byStatus.pending,
      approvedMerchants: byStatus.approved,
      rejectedMerchants: byStatus.rejected,
      totalCategories,
      enabledCategories,
      todayOrders: 0,
      todayRevenue: 0,
    };
  }
}
