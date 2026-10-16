import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/**
 * 登录请求。
 */
export class LoginDto {
  @ApiProperty({ example: 'consumer' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username!: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: '密码不能为空' })
  password!: string;
}
