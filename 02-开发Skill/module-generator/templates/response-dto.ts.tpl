import { ApiProperty } from '@nestjs/swagger';
import { {{Entity}} } from '../entities/{{entityKebab}}.entity';

/**
 * {{ModuleName}} 响应 DTO：隔离实体与对外契约。
 */
export class {{ModuleName}}ResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  static from(entity: {{Entity}}): {{ModuleName}}ResponseDto {
    const dto = new {{ModuleName}}ResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    return dto;
  }
}
