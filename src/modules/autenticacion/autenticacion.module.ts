import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '@nestjs/config';

import { AutenticacionController } from '@controllers/autenticacion/autenticacion.controller';
import { UsuarioEntity } from '@models/usuarios/entities/usuario.entity';
import { AutenticacionService } from '@services/autenticacion/autenticacion.service';

import config from '@app/libs/config/config';

@Module({
  imports: [
    TypegooseModule.forFeature(
      [
        {
          typegooseClass: UsuarioEntity,
          schemaOptions: {
            collection: 'usuarios',
            versionKey: false,
          },
        },
      ],
      config().servidor.mongo.coopeartiva.nombre,
    ),
    ConfigModule,
  ],
  controllers: [AutenticacionController],
  providers: [AutenticacionService],
  exports: [],
})
export class AutenticacionModule {}
