import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * 创建 {{ModuleName}} 的请求 DTO：参数校验只放在这里。
 */
export class Create{{ModuleName}}Dto {
  @ApiProperty({ description: '标题' })
  @IsString()
  @IsNotEmpty({ message: '标题不能为空' })
  @MaxLength(50, { message: '标题长度不能超过50' })
  title: string;
}
