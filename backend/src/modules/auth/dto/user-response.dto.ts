import { ApiProperty } from '@nestjs/swagger';
import { User, UserRole } from '../entities/user.entity';

/**
 * 用户信息响应，不包含密码等敏感字段。
 */
export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'consumer' })
  username!: string;

  @ApiProperty({ example: '美食探索家' })
  nickname!: string;

  @ApiProperty({ enum: ['consumer', 'merchant', 'rider', 'admin'], example: 'consumer' })
  role!: UserRole;

  static from(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.username = user.username;
    dto.nickname = user.nickname ?? user.username;
    dto.role = user.role;
    return dto;
  }
}
