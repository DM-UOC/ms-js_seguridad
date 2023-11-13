import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { CreateRoleDto } from '@models/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@models/roles/dto/update-role.dto';

import { RolesService } from '@services/roles/roles.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern({ cmd: 'crear_rol' })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @MessagePattern({ cmd: 'listado_roles' })
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @MessagePattern({ cmd: 'editar_rol' })
  @Patch()
  update(@Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
