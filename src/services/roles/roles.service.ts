import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { CreateRoleDto } from '@models/roles/dto/create-role.dto';
import { RoleEntity } from '@models/roles/entities/role.entity';
import { UpdateRoleDto } from '@models/roles/dto/update-role.dto';
import { Types } from 'mongoose';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(RoleEntity)
    private readonly roleEntity: ReturnModelType<typeof RoleEntity>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    try {
      // * recoge el usuario...
      const { descripcion, usuario } = createRoleDto;
      // * registrando el usuario...
      return this.roleEntity.create({
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
        descripcion: {
          $nin: ['ADMINISTRADOR SISTEMA'],
        },
        'auditoria.activo': true,
      };
      // * retorna arreglo...
      return this.roleEntity.find(filtro);
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(updateRoleDto: UpdateRoleDto) {
    try {
      // * desestructura el id...
      const { _id } = updateRoleDto;
      // * actualiza el objeto...
      return this.roleEntity.updateOne(
        {
          _id: new Types.ObjectId(_id),
        },
        {
          $set: updateRoleDto,
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
    return `This action removes a #${id} role`;
  }
}
