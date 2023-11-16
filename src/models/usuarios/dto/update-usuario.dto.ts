import { PartialType } from '@nestjs/mapped-types';

import { CreateUsuarioDto } from './create-usuario.dto';
import { CreateClaveDto } from './create-clave.dto';
import { CreateCodigoDto } from './create-codigo.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  readonly _id: string;
  readonly roles?: string[];
  readonly correos?: CreateCodigoDto[];
  readonly claves?: CreateClaveDto[];
}
