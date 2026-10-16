import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export type UserRole = 'consumer' | 'merchant' | 'rider' | 'admin';

/**
 * 用户领域实体，与表 users 对应。
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  username!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 100 })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  nickname!: string | null;

  @Column({ type: 'varchar', length: 20, default: 'consumer' })
  role!: UserRole;

  @CreateDateColumn({ name: 'create_time' })
  createTime!: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime!: Date;
}
