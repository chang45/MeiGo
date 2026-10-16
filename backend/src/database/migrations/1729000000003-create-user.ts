import * as bcrypt from 'bcryptjs';
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 创建 users 表，并写入四个演示账号。
 */
export class CreateUserTable1729000000003 implements MigrationInterface {
  name = 'CreateUserTable1729000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "username" character varying(20) NOT NULL,
        "password_hash" character varying(100) NOT NULL,
        "nickname" character varying(20),
        "role" character varying(20) NOT NULL DEFAULT 'consumer',
        "create_time" TIMESTAMP NOT NULL DEFAULT now(),
        "update_time" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    const demoAccounts = [
      { username: 'consumer', password: '123456', nickname: '美食探索家', role: 'consumer' },
      { username: 'merchant', password: '123456', nickname: '示例商家', role: 'merchant' },
      { username: 'rider', password: '123456', nickname: '闪送骑手', role: 'rider' },
      { username: 'admin', password: 'admin123', nickname: '平台管理员', role: 'admin' },
    ];

    for (const account of demoAccounts) {
      const passwordHash = bcrypt.hashSync(account.password, 10);
      await queryRunner.query(
        `INSERT INTO "users" ("username", "password_hash", "nickname", "role") VALUES ($1, $2, $3, $4)`,
        [account.username, passwordHash, account.nickname, account.role],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "users"');
  }
}
