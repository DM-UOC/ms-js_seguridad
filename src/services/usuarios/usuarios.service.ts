import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { RpcException } from '@nestjs/microservices';
import { ReturnModelType } from '@typegoose/typegoose';

import { CreateUsuarioDto } from '@models/usuarios/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '@models/usuarios/dto/update-usuario.dto';
import { UsuarioEntity } from '@models/usuarios/entities/usuario.entity';
import { AuditoriaEntity } from '@app/src/models/auditoria/auditoria.entity';

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

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}