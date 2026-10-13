import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApplyMerchantDto } from './dto/apply-merchant.dto';
import { MerchantService } from './merchant.service';

/**
 * 商家接入层：商家提交入驻申请。
 */
@ApiTags('商家')
@Controller('merchants')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Post('apply')
  @ApiOperation({ summary: '商家入驻申请' })
  apply(@Body() dto: ApplyMerchantDto) {
    return this.merchantService.apply(dto);
  }
}
