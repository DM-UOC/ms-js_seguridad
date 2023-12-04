import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { RpcException } from '@nestjs/microservices';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { CreateUsuarioDto } from '@models/usuarios/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '@models/usuarios/dto/update-usuario.dto';
import { UsuarioEntity } from '@models/usuarios/entities/usuario.entity';
import { ActualizaUsuarioImagenDto } from '@models/usuarios/dto/actualiza-usuarioimagen.dto';
import { RegistraUsuarioCorreoDto } from '@models/usuarios/dto/registra-usuariocorreo.dto';
import { ActualizaUsuarioCorreoDto } from '@models/usuarios/dto/actualiza-usuario.correo.dto';

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
      const {
        identificacion,
        nombre_completo,
        direccion,
        usuario,
        telefonos,
        fecha_desde,
      } = createUsuarioDto;
      // * registrando el usuario...
      return this.usuarioEntity.create({
        identificacion,
        nombre_completo,
        direccion,
        telefonos,
        fecha_desde,
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
        telefonos,
        fecha_desde,
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
            telefonos,
            fecha_desde,
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

  private async inhabilitaCorreos(
    registraUsuarioCorreoDto: RegistraUsuarioCorreoDto,
  ) {
    try {
      // * recoge el usuario...
      const { usuario_id, usuario } = registraUsuarioCorreoDto;
      // * incrementa el # de intentos...
      return await this.usuarioEntity.updateOne(
        {
          _id: new Types.ObjectId(usuario_id),
        },
        {
          $set: {
            'correos.$[].principal': false,
            'correos.$[].auditoria': {
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

  async registraCorreo(registraUsuarioCorreoDto: RegistraUsuarioCorreoDto) {
    try {
      // * recoge el usuario...
      const { usuario_id, correo, usuario } = registraUsuarioCorreoDto;
      // * agregando datos de la auditoria dinámicamente...
      correo['auditoria'] = {
        fecha_actualiza: new Date(),
        usuario_actualiza: usuario,
      };
      // * verifica si el correo quiere que sea principal....
      // * actualiza el resto de correos a false...
      // eslint-disable-next-line prettier/prettier
      if(correo.principal) await this.inhabilitaCorreos(registraUsuarioCorreoDto);
      // * retorna resultado...
      return await this.usuarioEntity.findOneAndUpdate(
        {
          _id: new Types.ObjectId(usuario_id),
        },
        {
          $push: {
            correos: correo,
          },
          $set: {
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

  private async actualizaCorreoEstadoPrincipal(
    actualizaUsuarioCorreoDto: ActualizaUsuarioCorreoDto,
    estado = true,
  ) {
    try {
      // * desestructura el objeto...
      const { usuario_id, usuario } = actualizaUsuarioCorreoDto;
      // * actualiza el resto de correos su estado principal a false...
      return await this.usuarioEntity.findByIdAndUpdate(
        {
          _id: new Types.ObjectId(usuario_id),
        },
        {
          $set: {
            'correos.$[].principal': estado,
            'correos.$[].auditoria': {
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

  async editarCorreo(actualizaUsuarioCorreoDto: ActualizaUsuarioCorreoDto) {
    try {
      // * desestructura el objeto...
      const { _id, correo, principal, usuario } = actualizaUsuarioCorreoDto;
      // * si el correo pasa a ser principal = true, el resto del correo pasa a false...
      if (principal)
        await this.actualizaCorreoEstadoPrincipal(
          actualizaUsuarioCorreoDto,
          false,
        );
      // * actualiza el correo...
      return await this.usuarioEntity.findOneAndUpdate(
        {
          'correos._id': new Types.ObjectId(_id),
        },
        {
          $set: {
            'correos.$[correoId].correo': correo,
            'correos.$[correoId].principal': principal,
            'correos.$[correoId].auditoria': {
              fecha_actualiza: new Date(),
              usuario_actualiza: usuario,
            },
          },
        },
        {
          new: true,
          arrayFilters: [
            {
              'correoId._id': new Types.ObjectId(_id),
            },
          ],
        },
      );
    } catch (error) {
      throw error;
    }
  }

  eliminarCorreo(actualizaUsuarioCorreoDto: ActualizaUsuarioCorreoDto) {
    try {
    } catch (error) {
      throw error;
    }
  }
}
