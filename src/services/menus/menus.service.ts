import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { CreateMenuDto } from '@models/menus/dto/create-menu.dto';
import { UpdateMenuDto } from '@models/menus/dto/update-menu.dto';
import { MenuEntity } from '@models/menus/entities/menu.entity';

import { UsuariosService } from '@services/usuarios/usuarios.service';

@Injectable()
export class MenusService {
  constructor(
    @InjectModel(MenuEntity)
    private readonly menuEntity: ReturnModelType<typeof MenuEntity>,
    private readonly usuariosService: UsuariosService,
  ) {}

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
      const result: any = await this.usuariosService.retornaConsultaAggregate(
        arregloAggregate,
      );
      // * verifica que exista registro...
      if (result.length > 0) return result[0].menus;
      // * no existe datos...
      return [];
    } catch (error) {
      throw error;
    }
  }

  create(createMenuDto: CreateMenuDto) {
    try {
      // * recoge el usuario...
      const { descripcion, usuario } = createMenuDto;
      // * registrando el usuario...
      return this.menuEntity.create({
        descripcion,
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
        'auditoria.activo': true,
      };
      // * retorna arreglo...
      return this.menuEntity.find(filtro);
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(updateMenuDto: UpdateMenuDto) {
    try {
      // * recoge el usuario...
      const { _id, descripcion, usuario } = updateMenuDto;
      // * registrando el usuario...
      return this.menuEntity.findByIdAndUpdate(
        {
          _id: new Types.ObjectId(_id),
        },
        {
          $set: {
            descripcion,
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

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
