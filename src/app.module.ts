import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';

import { AutenticacionModule } from '@modules/autenticacion/autenticacion.module';
import { MongoModule } from '@modules/mongo/mongo.module';
import { UsuarioModule } from '@modules/mongo/usuarios/usuario.module';

import { AppService } from './app.service';

import config from '@app/libs/config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),     
    AutenticacionModule,
    UsuarioModule,
    MongoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
