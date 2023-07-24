import { NestFactory } from '@nestjs/core';
import { INestMicroservice } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

import config from '@app/libs/config/config';
import { Globals } from "@app/libs/config/globals";

declare const global: Globals;

async function bootstrap() {
  /**
   * * Inicio seteo de microservicio...
   */
  const appMicroservice: INestMicroservice = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: { 
      host: config().enlace,
      port: config().puerto
    }
  });
  // * escuchando microservicio...
  await appMicroservice.listen();
}
bootstrap();
