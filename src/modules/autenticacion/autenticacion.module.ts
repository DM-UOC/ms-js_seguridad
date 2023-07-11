import { Module } from '@nestjs/common';

import { AutenticacionController } from '@controllers/autenticacion/autenticacion.controller';
import { AutenticacionService } from '@services/autenticacion/autenticacion.service';

@Module({
  controllers: [AutenticacionController],
  providers: [AutenticacionService]
})
export class AutenticacionModule {}
