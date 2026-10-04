import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { {{ModuleName}}Service } from './{{moduleKebab}}.service';
import { Create{{ModuleName}}Dto } from './dto/create-{{moduleKebab}}.dto';
import { {{ModuleName}}ResponseDto } from './dto/{{moduleKebab}}-response.dto';

/**
 * {{ModuleName}} 接入层：只负责路由、参数校验与鉴权，业务委托 Service。
 */
@ApiTags('{{ModuleName}}')
@Controller('{{moduleKebab}}')
export class {{ModuleName}}Controller {
  constructor(private readonly {{moduleName}}Service: {{ModuleName}}Service) {}

  @Post()
  @ApiOperation({ summary: '创建{{ModuleName}}' })
  create(@Body() dto: Create{{ModuleName}}Dto) {
    return this.{{moduleName}}Service.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: '查询{{ModuleName}}' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.{{moduleName}}Service.findOne(id);
  }
}
