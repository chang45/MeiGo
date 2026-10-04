import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 创建 {{table}} 表。
 */
export class Create{{ModuleName}}Table{{timestamp}} implements MigrationInterface {
  name = 'Create{{ModuleName}}Table{{timestamp}}';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "{{table}}" (
        "id" SERIAL NOT NULL,
        "title" character varying(50) NOT NULL,
        "create_time" TIMESTAMP NOT NULL DEFAULT now(),
        "update_time" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_{{table}}" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "{{table}}"');
  }
}
