import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';

import { CreateSubmenuDto } from '@models/submenus/dto/create-submenu.dto';
import { UpdateSubmenuDto } from '@models/submenus/dto/update-submenu.dto';
import { MenuEntity } from '@models/menus/entities/menu.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types, mongo } from 'mongoose';

@Injectable()
export class SubmenusService {
  constructor(
    @InjectModel(MenuEntity)
    private readonly menuEntity: ReturnModelType<typeof MenuEntity>,
  ) {}

  async create(createSubmenuDto: CreateSubmenuDto) {
    try {
      // * recoge el usuario...
      const { usuario, menu_id, ...subMenuDto } = createSubmenuDto;
      // * registrando el usuario...
      const result = await this.menuEntity.findOneAndUpdate(
        {
          _id: new Types.ObjectId(menu_id),
        },
        {
          $push: {
            submenus: subMenuDto,
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
      // * retornamos el objeto que se creo...
      return subMenuDto;
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all submenus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} submenu`;
  }

  async update(updateSubmenuDto: UpdateSubmenuDto) {
    try {
      // * recoge el usuario...
      const { usuario, menu_id, _id, ...subMenuDto } = updateSubmenuDto;
      // * registrando el usuario...
      const result = await this.menuEntity.findOneAndUpdate(
        {
          'submenus._id': new Types.ObjectId(_id),
        },
        {
          $set: {
            'submenus.$[subId].descripcion': subMenuDto.descripcion,
            'submenus.$[subId].enlace': subMenuDto.enlace,
            'submenus.$[subId].icono': subMenuDto.icono,
            auditoria: {
              fecha_actualiza: new Date(),
              usuario_actualiza: usuario,
            },
          },
        },
        {
          new: true,
          arrayFilters: [
            {
              'subId._id': new mongo.ObjectId(_id),
            },
          ],
        },
      );
      // * retornamos el objeto que se actualizó...
      return subMenuDto;
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} submenu`;
  }
}
