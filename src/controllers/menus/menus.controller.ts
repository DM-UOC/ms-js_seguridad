import { Controller, Get, Body, Param, Delete } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CreateMenuDto } from '@models/menus/dto/create-menu.dto';
import { UpdateMenuDto } from '@models/menus/dto/update-menu.dto';
import { MenusService } from '@services/menus/menus.service';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @MessagePattern({ cmd: 'usuario_menus' })
  async menus(_id: string) {
    try {
      return await this.menusService.menus(_id);
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'crear_menu' })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @MessagePattern({ cmd: 'listado_menus' })
  findAll() {
    return this.menusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menusService.findOne(+id);
  }

  @MessagePattern({ cmd: 'editar_menu' })
  update(@Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menusService.remove(+id);
  }
}
