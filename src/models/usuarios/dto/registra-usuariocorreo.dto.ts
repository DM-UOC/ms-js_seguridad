import { CreateCorreoDto } from '@models/usuarios/dto/create-correo.dto';

export class RegistraUsuarioCorreoDto {
  readonly usuario_id: string; // * "sdg24fsd5gDSasdf"
  readonly correo: CreateCorreoDto;
  readonly usuario?: string;
}
