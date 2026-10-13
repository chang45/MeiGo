import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminMerchantController } from './admin-merchant.controller';
import { Merchant } from './entities/merchant.entity';
import { MerchantController } from './merchant.controller';
import { MerchantRepository } from './merchant.repository';
import { MerchantService } from './merchant.service';

/**
 * 商家业务模块。
 */
@Module({
  imports: [TypeOrmModule.forFeature([Merchant])],
  controllers: [MerchantController, AdminMerchantController],
  providers: [MerchantService, MerchantRepository],
  exports: [MerchantService],
})
export class MerchantModule {}
