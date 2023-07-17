import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AutenticacionDto } from '@models/autenticacion/dto/autenticacion.dto';
import { AutenticacionService } from '@services/autenticacion/autenticacion.service';

@Controller('autenticacion')
export class AutenticacionController {

  constructor(private readonly autenticacionService: AutenticacionService) {}

  @MessagePattern({ cmd: 'autenticacion' })
  autenticacion(autenticacionDto: AutenticacionDto) {
    return this.autenticacionService.autenticacion(autenticacionDto);
  }
  
}
