import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 创建 orders 表，并写入几条待接单的演示订单。
 */
export class CreateOrderTable1729000000005 implements MigrationInterface {
  name = 'CreateOrderTable1729000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" SERIAL NOT NULL,
        "order_no" character varying(32) NOT NULL,
        "merchant_id" integer,
        "merchant_name" character varying(100) NOT NULL,
        "customer_name" character varying(50) NOT NULL,
        "customer_phone" character varying(20) NOT NULL,
        "delivery_address" character varying(200) NOT NULL,
        "status" character varying(20) NOT NULL DEFAULT 'pending',
        "rider_id" integer,
        "accepted_at" TIMESTAMP,
        "delivered_at" TIMESTAMP,
        "create_time" TIMESTAMP NOT NULL DEFAULT now(),
        "update_time" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_orders_order_no" UNIQUE ("order_no"),
        CONSTRAINT "PK_orders" PRIMARY KEY ("id")
      )
    `);

    const seedOrders = [
      {
        orderNo: 'MT20261016001',
        merchantName: '示例商家（万达店）',
        customerName: '张同学',
        customerPhone: '13800000001',
        deliveryAddress: 'A 区 3 栋 501',
      },
      {
        orderNo: 'MT20261016002',
        merchantName: '示例商家（大学城店）',
        customerName: '李同学',
        customerPhone: '13800000002',
        deliveryAddress: 'B 区 6 栋 202',
      },
      {
        orderNo: 'MT20261016003',
        merchantName: '示例商家（科技园店）',
        customerName: '王老师',
        customerPhone: '13800000003',
        deliveryAddress: '教师公寓 1 栋 801',
      },
      {
        orderNo: 'MT20261016004',
        merchantName: '示例商家（万达店）',
        customerName: '赵同学',
        customerPhone: '13800000004',
        deliveryAddress: 'C 区 9 栋 1103',
      },
    ];

    for (const order of seedOrders) {
      await queryRunner.query(
        `INSERT INTO "orders" ("order_no", "merchant_name", "customer_name", "customer_phone", "delivery_address")
         VALUES ($1, $2, $3, $4, $5)`,
        [order.orderNo, order.merchantName, order.customerName, order.customerPhone, order.deliveryAddress],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "orders"');
  }
}
