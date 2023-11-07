import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';

import { AutenticacionModule } from '@modules/autenticacion/autenticacion.module';
import { MongoModule } from '@modules/mongo/mongo.module';
import { UsuarioModule } from '@modules/mongo/usuarios/usuario.module';
import { MenusModule } from '@modules/menus/menus.module';
import { RolesModule } from '@modules/roles/roles.module';

import { AppService } from './app.service';
import { SeguridadModule } from './modules/seguridad/seguridad.module';
import { UsuariosModule } from './controllers/usuarios/usuarios.module';

import config from '@app/libs/config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    AutenticacionModule,
    UsuarioModule,
    MongoModule,
    MenusModule,
    RolesModule,
    SeguridadModule,
    UsuariosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
