import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '@nestjs/config';

import { SubmenusController } from '@controllers/submenus/submenus.controller';
import { MenuEntity } from '@models/menus/entities/menu.entity';
import { SubmenusService } from '@services/submenus/submenus.service';

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
  controllers: [SubmenusController],
  providers: [SubmenusService],
})
export class SubmenusModule {}
