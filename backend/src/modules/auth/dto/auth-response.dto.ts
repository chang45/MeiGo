import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

/**
 * 登录 / 注册成功后的返回：用户信息 + JWT。
 */
export class AuthResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiJ9...' })
  token!: string;
}
