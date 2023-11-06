import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { AutenticacionDto } from '@models/autenticacion/dto/autenticacion.dto';
import { UsuarioEntity } from '@models/usuarios/entities/usuario.entity';

@Injectable()
export class AutenticacionService {
  constructor(
    @InjectModel(UsuarioEntity)
    private readonly usuarioEntity: ReturnModelType<typeof UsuarioEntity>,
    private readonly jwtService: JwtService,
  ) {}

  private async increamentaIntentos(
    usuarioEntity: UsuarioEntity,
  ): Promise<UsuarioEntity> {
    try {
      // * desestrucutura el objeto...
      const { _id } = usuarioEntity;
      // * incrementa el # de intentos...
      return await this.usuarioEntity.findByIdAndUpdate(
        {
          _id,
        },
        {
          $set: {
            'claves.$[clave].auditoria': {
              fecha_actualiza: new Date(),
              usuario_actualiza: usuarioEntity.usuario,
            },
          },
          $inc: {
            'claves.$[clave].intento': 1,
          },
        },
        {
          new: true,
          upsert: true,
          arrayFilters: [
            {
              'clave.auditoria.activo': true,
            },
          ],
        },
      );
    } catch (error) {
      throw error;
    }
  }

  private async eliminaIntentos(usuarioEntity: UsuarioEntity) {
    try {
      // * desestrucutura el objeto...
      const { _id } = usuarioEntity;
      // * incrementa el # de intentos...
      await this.usuarioEntity.findByIdAndUpdate(
        {
          _id,
        },
        {
          $set: {
            'claves.$[clave].activo': false,
            'claves.$[clave].auditoria': {
              fecha_actualiza: new Date(),
              usuario_actualiza: usuarioEntity.usuario,
            },
          },
        },
        {
          upsert: true,
          arrayFilters: [
            {
              'clave.auditoria.activo': true,
            },
          ],
        },
      );
      // * envía el mensaje de error...
      throw new RpcException(
        `Su usuario ha sido bloqueado hasta que genere un nuevo código de 6 dígitos.`,
      );
    } catch (error) {
      throw error;
    }
  }

  private async procesaIntentos(usuarioEntity: UsuarioEntity) {
    try {
      // * incrementa el contador de intentos..
      const usuarioIntentos = await this.increamentaIntentos(usuarioEntity);
      // * envia el mensaje
      const result = usuarioIntentos.claves.find(
        (clave) => clave.auditoria.activo === true,
      );
      // * si el resultado es === 3 desactivamos el código actual...
      // * el usuario tendrá que generar uno nuevo...
      if (result.intento === 3) await this.eliminaIntentos(usuarioEntity);
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
    // * desestructura el objeto...
    const { usuario } = usuarioEntity;
    // * payload...
    const payload = {
      usuario,
    };
    // * retornamos el token...
    return this.jwtService.sign(payload);
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
  ) {
    try {
      // * 1) verifica si el código no ha sufrido intennos fallidos...
      // * si existe, ya ha intentado + de 3 veces, enviamos el error...
      if (this.verificaHabilitadoPinCodigo(usuarioEntity))
        throw new RpcException(
          'Se ha bloqueado el número de intentos. Genere una nueva clave',
        );
      // * si el # de intentos no está excedido...
      // * verificamos el código que ingresa...
      await this.validaClave(usuarioEntity, codigo);
    } catch (error) {
      throw error;
    }
  }

  private async retornaConsultaAggregate(
    arregloAggregate: Array<any>,
  ): Promise<UsuarioEntity[]> {
    try {
      return await this.usuarioEntity.aggregate(arregloAggregate);
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
      return await this.retornaConsultaAggregate(arregloAggregate);
    } catch (error) {
      throw error;
    }
  }

  async autenticacion(autenticacionDto: AutenticacionDto) {
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
}
