import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { CreateMenuDto } from '@models/menus/dto/create-menu.dto';
import { UpdateMenuDto } from '@models/menus/dto/update-menu.dto';
import { UsuariosService } from '@services/usuarios/usuarios.service';

@Injectable()
export class MenusService {

  constructor(
    private readonly usuariosService: UsuariosService
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
    return 'This action adds a new menu';
  }

  findAll() {
    return `This action returns all menus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
