import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { {{ModuleName}}Controller } from './{{moduleKebab}}.controller';
import { {{ModuleName}}Service } from './{{moduleKebab}}.service';
import { {{ModuleName}}Repository } from './{{moduleKebab}}.repository';
import { {{Entity}} } from './entities/{{entityKebab}}.entity';

/**
 * {{ModuleName}} 业务模块。
 */
@Module({
  imports: [TypeOrmModule.forFeature([{{Entity}}])],
  controllers: [{{ModuleName}}Controller],
  providers: [{{ModuleName}}Service, {{ModuleName}}Repository],
  exports: [{{ModuleName}}Service],
})
export class {{ModuleName}}Module {}
