import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, Length, Matches, MaxLength } from 'class-validator';
import type { UserRole } from '../entities/user.entity';

export type SelfRegisterRole = Exclude<UserRole, 'admin'>;

const SELF_REGISTER_ROLES: SelfRegisterRole[] = ['consumer', 'merchant', 'rider'];

/**
 * 注册请求：身份只能选择 consumer / merchant / rider 三种。
 */
export class RegisterDto {
  @ApiProperty({ example: 'newuser', description: '3-20 位，仅限字母、数字、下划线或中文' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(3, 20, { message: '用户名长度需在 3-20 个字符之间' })
  @Matches(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, { message: '用户名只能包含字母、数字、下划线或中文' })
  username!: string;

  @ApiProperty({ example: '123456', description: '至少 6 位' })
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 50, { message: '密码长度至少 6 位' })
  password!: string;

  @ApiProperty({ required: false, example: '美食达人', description: '选填，默认使用用户名' })
  @IsOptional()
  @MaxLength(20, { message: '昵称不能超过 20 个字符' })
  nickname?: string;

  @ApiProperty({ enum: SELF_REGISTER_ROLES, example: 'consumer' })
  @IsIn(SELF_REGISTER_ROLES, { message: '注册身份只能是 consumer、merchant 或 rider' })
  role!: SelfRegisterRole;
}
