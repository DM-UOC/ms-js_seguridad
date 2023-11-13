import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';

import { RolesController } from '@controllers/roles/roles.controller';
import { RoleEntity } from '@models/roles/entities/role.entity';
import { RolesService } from '@services/roles/roles.service';

import config from '@app/libs/config/config';

@Module({
  imports: [
    TypegooseModule.forFeature(
      [
        {
          typegooseClass: RoleEntity,
          schemaOptions: {
            collection: 'roles',
            versionKey: false,
          },
        },
      ],
      config().servidor.mongo.coopeartiva.nombre,
    ),
    ConfigModule,
  ],  
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
