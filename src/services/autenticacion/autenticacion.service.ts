import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { AutenticacionDto } from '@models/autenticacion/dto/autenticacion.dto';
import { UsuarioEntity } from '@models/usuarios/entities/usuario.entity';

@Injectable()
export class AutenticacionService {

  constructor(
    @InjectModel(UsuarioEntity) private readonly usuarioEntity: ReturnModelType<typeof UsuarioEntity>,
    private configService: ConfigService
  ) {}

  async autenticacion(autenticacionDto: AutenticacionDto) {
    try {
      // * variable clave...
      let clave: string = '';
      // * desestructura el objeto...
      const { usuario } = autenticacionDto;
      let buscarPorUsuario = { usuario };
      let buscarPorCorreo = { 'correos.correo': usuario };
      // * verificamos datos...
      // * búsqueda por usuario...
      const registroUsuario = await this.usuarioEntity.findOne(buscarPorUsuario);
      // * búsqueda por correo...
      const registroCorreo = await this.usuarioEntity.findOne(buscarPorCorreo);
      // * verifica si retorna datos...
      if(!registroUsuario && !registroCorreo) throw new UnauthorizedException("usuario y/o claves incorrectas");
      // * retorno datos...
      if(registroUsuario) clave = registroUsuario.clave; 
      if(registroCorreo) clave = registroUsuario.clave; 
    } catch (error) {
      throw error;
    }
  }
}
