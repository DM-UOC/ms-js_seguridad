import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AutenticacionController } from '@controllers/autenticacion/autenticacion.controller';
import { AutenticacionService } from '@services/autenticacion/autenticacion.service';
import { UsuariosModule } from '@modules/usuarios/usuarios.module';

@Module({
  imports: [UsuariosModule, ConfigModule],
  controllers: [AutenticacionController],
  providers: [AutenticacionService],
  exports: [],
})
export class AutenticacionModule {}
