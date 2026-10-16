import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export type OrderStatus = 'pending' | 'accepted' | 'delivering' | 'completed';

/**
 * 订单领域实体，与表 orders 对应。
 * 状态机：pending（待接单）→ accepted（已接单）→ delivering（配送中）→ completed（已送达）。
 */
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'order_no', type: 'varchar', length: 32, unique: true })
  orderNo!: string;

  @Column({ name: 'merchant_id', type: 'int', nullable: true })
  merchantId!: number | null;

  @Column({ name: 'merchant_name', type: 'varchar', length: 100 })
  merchantName!: string;

  @Column({ name: 'customer_name', type: 'varchar', length: 50 })
  customerName!: string;

  @Column({ name: 'customer_phone', type: 'varchar', length: 20 })
  customerPhone!: string;

  @Column({ name: 'delivery_address', type: 'varchar', length: 200 })
  deliveryAddress!: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: OrderStatus;

  @Column({ name: 'rider_id', type: 'int', nullable: true })
  riderId!: number | null;

  @Column({ name: 'accepted_at', type: 'timestamp', nullable: true })
  acceptedAt!: Date | null;

  @Column({ name: 'delivered_at', type: 'timestamp', nullable: true })
  deliveredAt!: Date | null;

  @CreateDateColumn({ name: 'create_time' })
  createTime!: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime!: Date;
}
