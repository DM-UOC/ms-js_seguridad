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

import { ExceptionFilter } from '@filters/exception-filter/exception-filter';

import { CreateUsuarioDto } from '@models/usuarios/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '@models/usuarios/dto/update-usuario.dto';
import { ActualizaUsuarioImagenDto } from '@models/usuarios/dto/actualiza-usuarioimagen.dto';
import { RegistraUsuarioCorreoDto } from '@models/usuarios/dto/registra-usuariocorreo.dto';
import { ActualizaUsuarioCorreoDto } from '@models/usuarios/dto/actualiza-usuario.correo.dto';

import { UsuariosService } from '@services/usuarios/usuarios.service';

import config from '@app/libs/config/config';

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

  @MessagePattern({ cmd: 'imagen_usuario' })
  actualiazaImagen(
    @Body() actualizaUsuarioImagenDto: ActualizaUsuarioImagenDto,
  ) {
    try {
      return this.usuariosService.actualizaImagen(actualizaUsuarioImagenDto);
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({
    cmd: config().microservicios.seguridad.procesos.usuario.correo.registrar,
  })
  async registraCorreo(
    @Body() registraUsuarioCorreoDto: RegistraUsuarioCorreoDto,
  ) {
    try {
      return await this.usuariosService.registraCorreo(
        registraUsuarioCorreoDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({
    cmd: config().microservicios.seguridad.procesos.usuario.correo.editar,
  })
  async edidtarCorreo(
    @Body() actualizaUsuarioCorreoDto: ActualizaUsuarioCorreoDto
  ) {
    try {
      return await this.usuariosService.editarCorreo(
        actualizaUsuarioCorreoDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({
    cmd: config().microservicios.seguridad.procesos.usuario.correo.eliminar,
  })
  async eliminarCorreo(
    @Body() actualizaUsuarioCorreoDto: ActualizaUsuarioCorreoDto,
  ) {
    try {
      return await this.usuariosService.eliminarCorreo(
        actualizaUsuarioCorreoDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
