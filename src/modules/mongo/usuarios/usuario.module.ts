import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { UsuarioEntity } from '@models/usuarios/entities/usuario.entity';
import { AutenticacionModule } from '@modules/autenticacion/autenticacion.module';

import config from '@app/libs/config/config';

@Module({
    imports: [
      TypegooseModule.forFeature(
        [
          {
            typegooseClass: UsuarioEntity,
            schemaOptions: {
              collection: "usuarios",
              versionKey: false
            }
          }
        ],
        config().dbServer.mongo.catalogosGeneral.connName
      ),
    ],
    exports: [],
    controllers: [],
    providers: []
})
export class UsuarioModule {}