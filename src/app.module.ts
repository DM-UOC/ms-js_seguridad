import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AutenticacionModule } from '@modules/autenticacion/autenticacion.module';
import { MongoModule } from '@modules/mongo/mongo.module';
import { AppService } from './app.service';

@Module({
  imports: [
    AutenticacionModule, 
    MongoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
