import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

import { AutenticacionDto } from '@models/autenticacion/dto/autenticacion.dto';
import { UsuarioEntity } from '@models/usuarios/entities/usuario.entity';
import { UsuariosService } from '@services/usuarios/usuarios.service';

@Injectable()
export class AutenticacionService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  private async procesaIntentos(usuarioEntity: UsuarioEntity) {
    try {
      // * incrementa el contador de intentos..
      const usuarioIntentos = await this.usuariosService.increamentaIntentos(
        usuarioEntity,
      );
      // * envia el mensaje
      const result = usuarioIntentos.claves.find(
        (clave) => clave.auditoria.activo === true,
      );
      // * si el resultado es === 3 desactivamos el código actual...
      // * el usuario tendrá que generar uno nuevo...
      if (result.intento === 3)
        await this.usuariosService.eliminaIntentos(usuarioEntity);
      // * envía el mensaje de error...
      throw new RpcException(
        `El PIN de seguridad es Incorrecto. Tiene ${
          3 - result.intento
        } intento(s) para ingresar.`,
      );
    } catch (error) {
      throw error;
    }
  }

  private async retornaTokenUsuario(
    usuarioEntity: UsuarioEntity,
  ): Promise<string> {
    try {
      // * desestructura el objeto...
      const { _id, usuario, nombre_completo } = usuarioEntity;
      // * payload...
      const payload = {
        _id,
        usuario,
        nombre_completo,
      };
      // * retornamos el token...
      return this.jwtService.sign(payload);
    } catch (error) {
      throw error;
    }
  }

  private async validaClave(
    usuarioEntity: UsuarioEntity,
    codigo: number,
  ): Promise<string> {
    try {
      // * buscamos si encuentra el pin...
      const result = usuarioEntity.claves.find((clave) => {
        // * verifica si es ultimo...
        // * si es el estado no está en eliminado...
        // * si el código son iguales...
        return clave.auditoria.activo && +clave.codigo === +codigo;
      });
      // * no encontró resultado registra los intentos fallidos...
      if (!result) await this.procesaIntentos(usuarioEntity);
      // * encontró el pin y fue validado...
      // * retorna JWT...
      return await this.retornaTokenUsuario(usuarioEntity);
    } catch (error) {
      throw error;
    }
  }

  private verificaHabilitadoPinCodigo(usuarioEntity: UsuarioEntity) {
    try {
      // * buscamos si encuentra el pin...
      return usuarioEntity.claves.find((clave) => {
        // * verifica si es ultimo...
        // * si es el estado no está en eliminado...
        // * si el código son iguales...
        return clave.intento === 3;
      });
    } catch (error) {
      throw error;
    }
  }

  private async verificaCredenciales(
    usuarioEntity: UsuarioEntity,
    codigo: number,
  ): Promise<string> {
    try {
      // * 1) verifica si el código no ha sufrido intennos fallidos...
      // * si existe, ya ha intentado + de 3 veces, enviamos el error...
      if (this.verificaHabilitadoPinCodigo(usuarioEntity))
        throw new RpcException(
          'Se ha bloqueado el número de intentos. Genere una nueva clave',
        );
      // * si el # de intentos no está excedido...
      // * verificamos el código que ingresa...
      return await this.validaClave(usuarioEntity, codigo);
    } catch (error) {
      throw error;
    }
  }

  private async verificaExisteCorreo(autenticacionDto: AutenticacionDto) {
    try {
      // * desestructura el objeto...
      const { email } = autenticacionDto;
      // * filtro por correo...
      const arregloAggregate = [
        {
          $unwind: '$correos',
        },
        {
          $match: {
            'correos.correo': email,
            'correos.principal': true,
            'auditoria.activo': true,
          },
        },
        {
          $limit: 1,
        },
      ];
      // * busca resultado...
      return await this.usuariosService.retornaConsultaAggregate(
        arregloAggregate,
      );
    } catch (error) {
      throw error;
    }
  }

  async autenticacion(autenticacionDto: AutenticacionDto): Promise<string> {
    try {
      const { password } = autenticacionDto;
      // * búsqueda por correo...
      const autenticacion = await this.verificaExisteCorreo(autenticacionDto);
      // * verifica si retorna datos...
      if (autenticacion.length === 0)
        throw new RpcException(
          '¡Usuario y/o correo electrónico incorrectos. Verifique!',
        );
      // * validamos el código que ingrsa...
      return await this.verificaCredenciales(autenticacion[0], password);
    } catch (error) {
      throw error;
    }
  }

  async menus(_id: string) {
    try {
      // * consulta aggregate...
      const arregloAggregate = [
        {
          $match: {
            _id: new Types.ObjectId(_id),
          },
        },
        {
          $unwind: '$roles',
        },
        {
          $addFields: {
            usuario_roles: { $toObjectId: '$roles' },
          },
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'usuario_roles',
            foreignField: '_id',
            as: 'roles_usuario',
          },
        },
        {
          $unwind: '$roles_usuario',
        },
        {
          $project: {
            'roles_usuario.menus': 1,
          },
        },
        {
          $unwind: '$roles_usuario.menus',
        },
        {
          $addFields: {
            menus_usuario: { $toObjectId: '$roles_usuario.menus' },
          },
        },
        {
          $group: {
            _id: '$_id',
            menus_usuario: {
              $push: '$menus_usuario',
            },
          },
        },
        {
          $lookup: {
            from: 'menus',
            localField: 'menus_usuario',
            foreignField: '_id',
            as: 'menus',
          },
        },
        {
          $project: {
            menus: 1,
          },
        },
      ];
      // * busca resultado...
      return await this.usuariosService.retornaConsultaAggregate(
        arregloAggregate,
      );
    } catch (error) {
      throw error;
    }
  }
}
