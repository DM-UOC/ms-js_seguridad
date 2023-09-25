import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { AutenticacionDto } from '@models/autenticacion/dto/autenticacion.dto';
import { UsuarioEntity } from '@models/usuarios/entities/usuario.entity';

@Injectable()
export class AutenticacionService {

  constructor(
    @InjectModel(UsuarioEntity) private readonly usuarioEntity: ReturnModelType<typeof UsuarioEntity>,
  ) {}

  private async increamentaIntentos(usuarioEntity: UsuarioEntity) {
    try {
      // * desestrucutura el objeto...
      const { _id } = usuarioEntity;
      // * incrementa el # de intentos...
      return await this.usuarioEntity.findByIdAndUpdate({
        _id
      }, {
        $set: {
          'claves.$[clave].auditoria': {
            fecha_actualiza: new Date(),
            usuario_actualiza: usuarioEntity.usuario
          }
        },
        $inc: {
          'claves.$[clave].intento': 1
        }
      }, {
        upsert: true,
        arrayFilters: [
          {
            "clave.activo": true 
          }
        ]
      });
    } catch (error) {
      throw error;
    }
  }

  private async eliminaIntentos(usuarioEntity: UsuarioEntity) {
    try {
      // * desestrucutura el objeto...
      const { _id } = usuarioEntity;
      // * incrementa el # de intentos...
      await this.usuarioEntity.findByIdAndUpdate({
        _id
      }, {
        $set: {
          'claves.$[clave].activo': false,
          'claves.$[clave].auditoria': {
            fecha_actualiza: new Date(),
            usuario_actualiza: usuarioEntity.usuario
          }
        },
      }, {
        upsert: true,
        arrayFilters: [
          {
            "clave.activo": true 
          }
        ]
      });
      // * envía el mensaje de error...
      throw new RpcException(`Su usuario ha sido bloqueado hasta que genere un nuevo código de 6 dígitos.`);      
    } catch (error) {
      throw error;
    }
  }

  private async procesaIntentos(usuarioEntity: UsuarioEntity) {
    try {
      // * incrementa el contador de intentos..
      const usuarioIntentos = await this.increamentaIntentos(usuarioEntity);
      // * envia el mensaje
      const result = usuarioIntentos.claves.find((clave) => clave.activo === true);
      // * si el resultado es === 3 desactivamos el código actual...
      // * el usuario tendrá que generar uno nuevo...
      if(result.intento === 3) await this.eliminaIntentos(usuarioEntity);
      // * envía el mensaje de error...
      throw new RpcException(`Tiene ${(result.intento - 3)} intentos para ingresar.`);
    } catch (error) {
      throw error;
    }
  }

  private async validaClave(usuarioEntity: UsuarioEntity, codigo: number): Promise<boolean> {
    try {
      // * buscamos si encuentra el pin...
      const result = usuarioEntity.claves.find((clave) => {
        // * verifica si es ultimo...
        // * si es el estado no está en eliminado...
        // * si el código son iguales...
        return !clave.activo && clave.codigo === codigo;
      });
      // * no encontró resultado registra los intentos fallidos...
      if(!result) await this.procesaIntentos(usuarioEntity);
      // * encontró el pin y fue validado...
      return true;
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

  private async verificaCredenciales(usuarioEntity: UsuarioEntity, codigo: number) {
    try {
      // * 1) verifica si el código no ha sufrido intennos fallidos...
      // * si existe, ya ha intentado + de 3 veces, enviamos el error...
      if(this.verificaHabilitadoPinCodigo(usuarioEntity)) throw new RpcException("Se ha bloqueado el núkero de intentos. Genere una nueva clave");
      // * si el # de intentos no está excedido...
      // * verificamos el código que ingresa...
      await this.validaClave(usuarioEntity, codigo);
    } catch (error) {
      throw error;
    }
  }

  async autenticacion(autenticacionDto: AutenticacionDto) {
    try {
      // * desestructura el objeto...
      const { email, password } = autenticacionDto;
      // * filtro por usuario...
      let buscarPorUsuario = { email, activo: true };
      // * filtro por correo...
      let buscarPorCorreo = { 'correos.correo': email, 'correos.principal': true, activo: true };
      // * verificamos datos...
      // * búsqueda por usuario...
      const registroUsuario = await this.usuarioEntity.findOne(buscarPorUsuario);
      // * búsqueda por correo...
      const registroCorreo = await this.usuarioEntity.findOne(buscarPorCorreo);
      // * verifica si retorna datos...
      if(!registroUsuario && !registroCorreo) throw new RpcException("¡Usuario y/o correo electrónico incorrectos. Verifique!");
      // * validamos el código que ingrsa...
      this.verificaCredenciales(!registroUsuario? registroCorreo: registroUsuario, password);
    } catch (error) {
      throw error;
    }
  }
}
