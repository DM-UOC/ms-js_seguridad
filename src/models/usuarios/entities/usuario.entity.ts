import { ObjectId } from 'mongoose';
import { prop } from '@typegoose/typegoose';

import { CorreoEntity } from '@models/usuarios/entities/correo.entity';
import { AuditoriaEntity } from '@models/auditoria/auditoria.entity';
import { PinCodigoEntity } from '@models/usuarios/entities/pincodigo.entity';

export class UsuarioEntity {
  readonly _id: ObjectId;
  @prop({ default: '' })
  identificacion!: string;
  @prop({})
  nombre_completo!: string;
  @prop({})
  direccion!: string;
  @prop({ type: PinCodigoEntity, default: [] })
  claves?: PinCodigoEntity[];
  @prop({ default: [] })
  roles?: string[];
  @prop({ type: CorreoEntity, default: [] })
  correos?: CorreoEntity[];
  @prop({ type: AuditoriaEntity, _id: false })
  auditoria: AuditoriaEntity;
}
