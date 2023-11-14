import { Controller, Get, Body, Param, Delete } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CreateSubmenuDto } from '@models/submenus/dto/create-submenu.dto';
import { UpdateSubmenuDto } from '@models/submenus/dto/update-submenu.dto';
import { SubmenusService } from '@services/submenus/submenus.service';

@Controller('submenus')
export class SubmenusController {
  constructor(private readonly submenusService: SubmenusService) {}

  @MessagePattern({ cmd: 'crear_submenu' })
  create(@Body() createSubmenuDto: CreateSubmenuDto) {
    return this.submenusService.create(createSubmenuDto);
  }

  @Get()
  findAll() {
    return this.submenusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submenusService.findOne(+id);
  }

  @MessagePattern({ cmd: 'editar_submenu' })
  update(@Body() updateSubmenuDto: UpdateSubmenuDto) {
    return this.submenusService.update(updateSubmenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submenusService.remove(+id);
  }
}
