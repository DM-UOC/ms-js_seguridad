import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AutenticacionDto } from '@models/autenticacion/dto/autenticacion.dto';
import { AutenticacionService } from '@services/autenticacion/autenticacion.service';
import { ExceptionFilter } from '@app/src/filters/exception-filter/exception-filter';

@UseFilters(new ExceptionFilter())
@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @MessagePattern({ cmd: 'autenticacion' })
  async autenticacion(autenticacionDto: AutenticacionDto) {
    try {
      return await this.autenticacionService.autenticacion(autenticacionDto);
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'menus' })
  async menus(_id: string) {
    try {
      return await this.autenticacionService.menus(_id);
    } catch (error) {
      throw error;
    }
  }
}
