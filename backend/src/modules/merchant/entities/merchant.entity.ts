import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export type MerchantStatus = 'pending' | 'approved' | 'rejected';

/**
 * 商家领域实体，与表 merchant 对应。
 */
@Entity('merchant')
export class Merchant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'owner_id', type: 'int', unique: true, nullable: true })
  ownerId!: number | null;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ name: 'contact_name', type: 'varchar', length: 50 })
  contactName!: string;

  @Column({ type: 'varchar', length: 20 })
  phone!: string;

  @Column({ type: 'varchar', length: 200 })
  address!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: MerchantStatus;

  @Column({ name: 'reject_reason', type: 'varchar', length: 200, nullable: true })
  rejectReason!: string | null;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt!: Date | null;

  @CreateDateColumn({ name: 'create_time' })
  createTime!: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime!: Date;
}
