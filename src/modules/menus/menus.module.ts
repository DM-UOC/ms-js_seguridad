import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';

import { MenusController } from '@controllers/menus/menus.controller';
import { MenuEntity } from '@models/menus/entities/menu.entity';
import { MenusService } from '@services/menus/menus.service';

import config from '@app/libs/config/config';
@Module({
  imports: [
    TypegooseModule.forFeature(
      [
        {
          typegooseClass: MenuEntity,
          schemaOptions: {
            collection: 'menus',
            versionKey: false,
          },
        },
      ],
      config().servidor.mongo.coopeartiva.nombre,
    ),
    ConfigModule,
  ],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService],
})
export class MenusModule {}
