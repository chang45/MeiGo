import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 给 merchant 表增加 owner_id，并建立唯一索引保证“一个商家只能注册一个店铺”。
 */
export class AlterMerchantAddOwner1729000000004 implements MigrationInterface {
  name = 'AlterMerchantAddOwner1729000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "merchant" ADD COLUMN "owner_id" integer');
    await queryRunner.query('CREATE UNIQUE INDEX "UQ_merchant_owner_id" ON "merchant" ("owner_id")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "UQ_merchant_owner_id"');
    await queryRunner.query('ALTER TABLE "merchant" DROP COLUMN "owner_id"');
  }
}
