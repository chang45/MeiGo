import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ApplyMerchantDto } from './dto/apply-merchant.dto';
import { MerchantResponseDto } from './dto/merchant-response.dto';
import { ReviewMerchantDto } from './dto/review-merchant.dto';
import { MerchantStatus } from './entities/merchant.entity';
import { MerchantRepository } from './merchant.repository';

const ALLOWED_STATUS: MerchantStatus[] = ['pending', 'approved', 'rejected'];

/**
 * 商家应用服务：入驻申请、审核与查询。
 */
@Injectable()
export class MerchantService {
  private readonly logger = new Logger(MerchantService.name);

  constructor(
    private readonly merchantRepository: MerchantRepository,
    private readonly dataSource: DataSource,
  ) {}

  /** 商家提交入驻申请，一个商家只能拥有一个店铺。 */
  async apply(ownerId: number, dto: ApplyMerchantDto): Promise<MerchantResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const existing = await this.merchantRepository.findOneByOwner(ownerId);
      if (existing) {
        if (existing.status === 'pending') {
          throw new ConflictException('你的店铺申请正在审核中，请耐心等待');
        }
        if (existing.status === 'approved') {
          throw new ConflictException('你已拥有一个店铺，每个商家只能注册一个店铺');
        }
        // 被驳回后可重新提交，复用同一条记录，保证一名商家始终只有一家店铺。
        existing.name = dto.name;
        existing.contactName = dto.contactName;
        existing.phone = dto.phone;
        existing.address = dto.address;
        existing.description = dto.description ?? null;
        existing.status = 'pending';
        existing.rejectReason = null;
        existing.reviewedAt = null;
        const saved = await manager.save(existing);
        this.logger.log(`商家重新提交入驻申请：${saved.name}`);
        return MerchantResponseDto.from(saved);
      }

      const entity = this.merchantRepository.create(dto, ownerId);
      const saved = await manager.save(entity);
      this.logger.log(`商家提交入驻申请：${saved.name}`);
      return MerchantResponseDto.from(saved);
    });
  }

  /** 查询当前商家自己的店铺，没有则返回 null。 */
  async findMyStore(ownerId: number): Promise<MerchantResponseDto | null> {
    const entity = await this.merchantRepository.findOneByOwner(ownerId);
    return entity ? MerchantResponseDto.from(entity) : null;
  }

  /** 按状态查询商家列表。 */
  async findAll(status?: string): Promise<MerchantResponseDto[]> {
    const normalized = status as MerchantStatus | undefined;
    if (normalized && !ALLOWED_STATUS.includes(normalized)) {
      throw new BadRequestException('status 只能是 pending、approved 或 rejected');
    }
    const entities = await this.merchantRepository.findAll(normalized);
    return entities.map(MerchantResponseDto.from);
  }

  /** 审核商家：通过或驳回。 */
  async review(id: number, dto: ReviewMerchantDto): Promise<MerchantResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const entity = await this.merchantRepository.findOne(id);
      if (!entity) {
        throw new NotFoundException('商家不存在');
      }
      entity.status = dto.approve ? 'approved' : 'rejected';
      entity.reviewedAt = new Date();
      entity.rejectReason = dto.approve ? null : dto.reason?.trim() || null;
      const saved = await manager.save(entity);
      this.logger.log(`审核商家 ${saved.name} -> ${saved.status}`);
      return MerchantResponseDto.from(saved);
    });
  }
}
