import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AutenticacionController } from '@controllers/autenticacion/autenticacion.controller';
import { AutenticacionService } from '@services/autenticacion/autenticacion.service';
import { UsuarioModule } from '../mongo/usuarios/usuario.module';

@Module({
  imports: [UsuarioModule, ConfigModule],
  controllers: [AutenticacionController],
  providers: [AutenticacionService],
  exports: [],
})
export class AutenticacionModule {}
