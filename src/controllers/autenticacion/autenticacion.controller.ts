import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { CreateAutenticacionDto } from '@models/autenticacion/dto/create-autenticacion.dto';
import { UpdateAutenticacionDto } from '@models/autenticacion/dto/update-autenticacion.dto';
import { AutenticacionService } from '@services/autenticacion/autenticacion.service';

@Controller('autenticacion')
export class AutenticacionController {

  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post()
  create(@Body() createAutenticacionDto: CreateAutenticacionDto) {
    return this.autenticacionService.create(createAutenticacionDto);
  }

  @Get()
  findAll() {
    return this.autenticacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.autenticacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAutenticacionDto: UpdateAutenticacionDto) {
    return this.autenticacionService.update(+id, updateAutenticacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.autenticacionService.remove(+id);
  }
  
}
