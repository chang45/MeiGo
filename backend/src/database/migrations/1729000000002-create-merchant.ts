import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 创建 merchant 表并写入演示商家。
 */
export class CreateMerchantTable1729000000002 implements MigrationInterface {
  name = 'CreateMerchantTable1729000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "merchant" (
        "id" SERIAL NOT NULL,
        "name" character varying(100) NOT NULL,
        "contact_name" character varying(50) NOT NULL,
        "phone" character varying(20) NOT NULL,
        "address" character varying(200) NOT NULL,
        "description" character varying(500),
        "status" character varying(20) NOT NULL DEFAULT 'pending',
        "reject_reason" character varying(200),
        "reviewed_at" TIMESTAMP,
        "create_time" TIMESTAMP NOT NULL DEFAULT now(),
        "update_time" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_merchant" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      INSERT INTO "merchant" ("name", "contact_name", "phone", "address", "description", "status", "reviewed_at") VALUES
      ('老北京炸酱面馆', '王强', '13800000001', '北京市东城区xx路1号', '地道京味面食', 'approved', now()),
      ('鲜果多水果店', '李娜', '13800000002', '北京市朝阳区xx街2号', '新鲜水果配送', 'pending', NULL),
      ('老王烧烤', '赵磊', '13800000003', '北京市海淀区xx巷3号', '夜宵烧烤', 'pending', NULL)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "merchant"');
  }
}
