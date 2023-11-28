import { ObjectId } from 'mongoose';
import { prop } from '@typegoose/typegoose';

import { CorreoEntity } from '@models/usuarios/entities/correo.entity';
import { AuditoriaEntity } from '@models/auditoria/auditoria.entity';
import { PinCodigoEntity } from '@models/usuarios/entities/pincodigo.entity';
import { ImagenEntity } from '@models/usuarios/entities/imagen.entity';

export class UsuarioEntity {
  readonly _id: ObjectId;
  @prop({ default: '' })
  identificacion!: string;
  @prop({})
  nombre_completo!: string;
  @prop({})
  direccion!: string;
  @prop({ type: ImagenEntity, _id: false })
  imagen?: ImagenEntity;
  @prop({ type: PinCodigoEntity, default: [], select: false })
  claves?: PinCodigoEntity[];
  @prop({ default: [] })
  roles?: string[];
  @prop({ default: [] })
  telefonos?: string[];
  @prop({ type: CorreoEntity, default: [] })
  correos?: CorreoEntity[];
  @prop({
    type: AuditoriaEntity,
    _id: false,
    default: new AuditoriaEntity(),
    select: false,
  })
  auditoria?: AuditoriaEntity;
}
