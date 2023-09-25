import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AutenticacionDto } from '@models/autenticacion/dto/autenticacion.dto';
import { AutenticacionService } from '@services/autenticacion/autenticacion.service';
import { ExceptionFilter } from '@app/src/filters/exception-filter/exception-filter';

@Controller('autenticacion')
export class AutenticacionController {

  constructor(private readonly autenticacionService: AutenticacionService) {}

  @UseFilters(new ExceptionFilter())
  @MessagePattern({ cmd: 'autenticacion' })
  async autenticacion(autenticacionDto: AutenticacionDto) {
    try {      
      return await this.autenticacionService.autenticacion(autenticacionDto);
    } catch (error) {
      throw error;
    }
  }
  
}
