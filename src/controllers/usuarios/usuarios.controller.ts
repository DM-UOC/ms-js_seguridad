import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ExceptionFilter } from '@app/src/filters/exception-filter/exception-filter';
import { CreateUsuarioDto } from '@models/usuarios/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '@models/usuarios/dto/update-usuario.dto';
import { UsuariosService } from '@services/usuarios/usuarios.service';

@UseFilters(new ExceptionFilter())
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @MessagePattern({ cmd: 'crear_usuario' })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    try {
      return this.usuariosService.create(createUsuarioDto);
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'listado_usuarios' })
  findAll() {
    return this.usuariosService.findAll();
  }

  @MessagePattern({ cmd: 'identificacion_usuario' })
  findOne(@Body() id: string) {
    return this.usuariosService.findOne(id);
  }

  @MessagePattern({ cmd: 'verifica_correo_usuarios' })
  encuentraUnicoCorreo(@Body() correo: string) {
    return this.usuariosService.encuentraUnicoCorreo(correo);
  }

  @MessagePattern({ cmd: 'editar_usuario' })
  update(@Body() updateUsuarioDto: UpdateUsuarioDto) {
    try {
      return this.usuariosService.update(updateUsuarioDto);
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'registro_inicial_usuario' })
  actualizaRegistroInicial(@Body() updateUsuarioDto: UpdateUsuarioDto) {
    try {
      return this.usuariosService.actualiazaRegistroInicial(updateUsuarioDto);
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'registro_pin_usuario' })
  actualiazaPin(@Body() updateUsuarioDto: UpdateUsuarioDto) {
    try {
      return this.usuariosService.actualiazaPin(updateUsuarioDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
