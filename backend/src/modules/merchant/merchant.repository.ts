import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplyMerchantDto } from './dto/apply-merchant.dto';
import { Merchant, MerchantStatus } from './entities/merchant.entity';

/**
 * 商家仓储：只负责数据访问，禁止写业务规则。
 */
@Injectable()
export class MerchantRepository {
  constructor(
    @InjectRepository(Merchant)
    private readonly repo: Repository<Merchant>,
  ) {}

  create(dto: ApplyMerchantDto): Merchant {
    return this.repo.create({ ...dto, description: dto.description ?? null, status: 'pending' });
  }

  findAll(status?: MerchantStatus): Promise<Merchant[]> {
    return this.repo.find({
      where: status ? { status } : {},
      order: { createTime: 'DESC' },
    });
  }

  findOne(id: number): Promise<Merchant | null> {
    return this.repo.findOneBy({ id });
  }
}
