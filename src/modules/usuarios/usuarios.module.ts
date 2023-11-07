import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '@nestjs/config';

import { UsuariosController } from '@controllers/usuarios/usuarios.controller';
import { UsuarioEntity } from '@models/usuarios/entities/usuario.entity';
import { UsuariosService } from '@services/usuarios/usuarios.service';

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
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
