import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';

/**
 * 平台统计接入层。
 */
@ApiTags('平台统计')
@Controller('admin/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('overview')
  @ApiOperation({ summary: '平台统计概览' })
  getOverview() {
    return this.statisticsService.getOverview();
  }
}
