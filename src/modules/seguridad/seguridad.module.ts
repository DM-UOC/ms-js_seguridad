import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import config from '@app/libs/config/config';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: config().seguridad.secreto,
      signOptions: {
        expiresIn: config().seguridad.tiempo.caducidad,
      },
    }),
  ],
})
export class SeguridadModule {}
