import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';

import { AutenticacionModule } from '@modules/autenticacion/autenticacion.module';
import { MongoModule } from '@modules/mongo/mongo.module';
import { UsuarioModule } from '@modules/mongo/usuarios/usuario.module';
import { MenusModule } from '@modules/menus/menus.module';
import { RolesModule } from '@modules/roles/roles.module';
import { SeguridadModule } from '@modules/seguridad/seguridad.module';
import { UsuariosModule } from '@modules/usuarios/usuarios.module';
import { SubmenusModule } from '@modules/submenus/submenus.module';

import { UtilitariosService } from '@services/utilitarios/utilitarios.service';

import { AppService } from './app.service';

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
    SubmenusModule,
  ],
  controllers: [AppController],
  providers: [AppService, UtilitariosService],
})
export class AppModule {}
