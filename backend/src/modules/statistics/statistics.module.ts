import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

/**
 * 平台统计业务模块。
 */
@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
