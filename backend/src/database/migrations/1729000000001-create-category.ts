import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 创建 category 表并写入默认分类。
 */
export class CreateCategoryTable1729000000001 implements MigrationInterface {
  name = 'CreateCategoryTable1729000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "category" (
        "id" SERIAL NOT NULL,
        "name" character varying(50) NOT NULL,
        "icon" character varying(20),
        "sort" integer NOT NULL DEFAULT 0,
        "enabled" boolean NOT NULL DEFAULT true,
        "create_time" TIMESTAMP NOT NULL DEFAULT now(),
        "update_time" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_category_name" UNIQUE ("name"),
        CONSTRAINT "PK_category" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      INSERT INTO "category" ("name", "icon", "sort", "enabled") VALUES
      ('外卖', '🍜', 1, true),
      ('到店美食', '☕', 2, true),
      ('超市便利', '🏪', 3, true),
      ('果蔬生鲜', '🥬', 4, true),
      ('买药', '💊', 5, true)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "category"');
  }
}
