import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { RpcException } from '@nestjs/microservices';
import { ReturnModelType } from '@typegoose/typegoose';

import { CreateUsuarioDto } from '@models/usuarios/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '@models/usuarios/dto/update-usuario.dto';
import { UsuarioEntity } from '@models/usuarios/entities/usuario.entity';
import { Types } from 'mongoose';
import { ActualizaUsuarioImagenDto } from '@app/src/models/usuarios/dto/actualiza-usuarioimagen.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(UsuarioEntity)
    private readonly usuarioEntity: ReturnModelType<typeof UsuarioEntity>,
  ) {}

  async increamentaIntentos(
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
              usuario_actualiza: usuarioEntity.identificacion,
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

  async eliminaIntentos(usuarioEntity: UsuarioEntity) {
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
              usuario_actualiza: usuarioEntity.identificacion,
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

  async retornaConsultaAggregate(
    arregloAggregate: Array<any>,
  ): Promise<UsuarioEntity[]> {
    try {
      return await this.usuarioEntity.aggregate(arregloAggregate);
    } catch (error) {
      throw error;
    }
  }

  create(createUsuarioDto: CreateUsuarioDto) {
    try {
      // * recoge el usuario...
      const { identificacion, nombre_completo, direccion, usuario } =
        createUsuarioDto;
      // * registrando el usuario...
      return this.usuarioEntity.create({
        identificacion,
        nombre_completo,
        direccion,
        auditoria: {
          usuario_ingresa: usuario,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    try {
      // * filtro...
      const filtro = {
        identificacion: {
          $nin: ['SUP-ADM'],
        },
        'auditoria.activo': true,
      };
      // * retorna arreglo...
      return this.usuarioEntity.find(filtro);
    } catch (error) {
      throw error;
    }
  }

  private retornaConsultaUnico(filtro: object) {
    // * retorna arreglo...
    return this.usuarioEntity.findOne(filtro);
  }

  findOne(identificacion: string) {
    try {
      // * filtro...
      const filtro = {
        identificacion,
        'auditoria.activo': true,
      };
      // * retorna la consutla...
      return this.retornaConsultaUnico(filtro);
    } catch (error) {
      throw error;
    }
  }

  encuentraUnicoCorreo(correo: string) {
    try {
      // * filtro...
      const filtro = {
        'correos.correo': correo,
        'correos.principal': true,
        'correos.auditoria.activo': true,
      };
      // * retorna la consutla...
      return this.retornaConsultaUnico(filtro);
    } catch (error) {
      throw error;
    }
  }

  update(updateUsuarioDto: UpdateUsuarioDto) {
    try {
      // * recoge el usuario...
      const {
        _id,
        identificacion,
        nombre_completo,
        direccion,
        usuario,
        roles,
      } = updateUsuarioDto;
      // * registrando el usuario...
      return this.usuarioEntity.findByIdAndUpdate(
        {
          _id: new Types.ObjectId(_id),
        },
        {
          $set: {
            identificacion,
            nombre_completo,
            direccion,
            roles,
            auditoria: {
              fecha_actualiza: new Date(),
              usuario_actualiza: usuario,
            },
          },
        },
        {
          new: true,
        },
      );
    } catch (error) {
      throw error;
    }
  }

  actualiazaRegistroInicial(
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<UsuarioEntity> {
    try {
      // * recoge el usuario...
      const { _id, claves, correos, identificacion } = updateUsuarioDto;
      // * actualizando información auditoria...
      // * correos...
      correos[0]['auditoria'] = {
        fecha_actualiza: new Date(),
        usuario_actualiza: identificacion,
      };
      // * claves...
      claves[0]['auditoria'] = {
        fecha_actualiza: new Date(),
        usuario_actualiza: identificacion,
      };
      // * retorna resultado...
      return this.usuarioEntity.findByIdAndUpdate(
        {
          _id: new Types.ObjectId(_id),
        },
        {
          $push: {
            correos,
            claves,
          },
        },
        {
          new: true,
        },
      );
    } catch (error) {
      throw error;
    }
  }

  actualiazaPin(updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioEntity> {
    try {
      // * recoge el usuario...
      const { _id, claves, identificacion } = updateUsuarioDto;
      // * actualizando información auditoria...
      // * claves...
      claves[0]['auditoria'] = {
        fecha_actualiza: new Date(),
        usuario_actualiza: identificacion,
      };
      // * retorna resultado...
      return this.usuarioEntity.findByIdAndUpdate(
        {
          _id: new Types.ObjectId(_id),
        },
        {
          $push: {
            claves,
          },
        },
        {
          new: true,
        },
      );
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }

  actualizaImagen(actualizaUsuarioImagenDto: ActualizaUsuarioImagenDto) {
    try {
      // * recoge el usuario...
      const { _id, imagen, identificacion } = actualizaUsuarioImagenDto;      
      // * retorna resultado...
      return this.usuarioEntity.findByIdAndUpdate(
        {
          _id: new Types.ObjectId(_id),
        },
        {
          $set: {
            imagen,
            auditoria: {
              fecha_actualiza: new Date(),
              usuario_actualiza: identificacion,
            }
          },
        },
        {
          new: true,
        },
      );      
    } catch (error) {
      throw error;
    }
  }

}
