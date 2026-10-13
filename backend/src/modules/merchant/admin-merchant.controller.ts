import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewMerchantDto } from './dto/review-merchant.dto';
import { MerchantService } from './merchant.service';

/**
 * 商家审核接入层（平台管理员）。
 */
@ApiTags('商家审核')
@Controller('admin/merchants')
export class AdminMerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get()
  @ApiOperation({ summary: '按状态查询商家列表' })
  findAll(@Query('status') status?: string) {
    return this.merchantService.findAll(status);
  }

  @Post(':id/review')
  @ApiOperation({ summary: '审核商家（通过/驳回）' })
  review(@Param('id', ParseIntPipe) id: number, @Body() dto: ReviewMerchantDto) {
    return this.merchantService.review(id, dto);
  }
}
