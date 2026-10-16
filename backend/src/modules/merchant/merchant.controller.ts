import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard, JwtPayload } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApplyMerchantDto } from './dto/apply-merchant.dto';
import { MerchantResponseDto } from './dto/merchant-response.dto';
import { MerchantService } from './merchant.service';

/**
 * 商家接入层：商家提交入驻申请。
 */
@ApiTags('商家')
@ApiBearerAuth()
@Controller('merchants')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Post('apply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('merchant')
  @ApiOperation({ summary: '商家入驻申请' })
  apply(@CurrentUser() user: JwtPayload, @Body() dto: ApplyMerchantDto): Promise<MerchantResponseDto> {
    return this.merchantService.apply(user.sub, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('merchant')
  @ApiOperation({ summary: '查询当前商家的店铺' })
  myStore(@CurrentUser() user: JwtPayload): Promise<MerchantResponseDto | null> {
    return this.merchantService.findMyStore(user.sub);
  }
}
