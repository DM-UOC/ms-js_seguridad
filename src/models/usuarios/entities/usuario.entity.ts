import { ObjectId } from 'mongoose';
import { prop } from '@typegoose/typegoose';

import { CorreoEntity } from '@models/usuarios/entities/correo.entity';
import { AuditoriaEntity } from '@models/auditoria/auditoria.entity';
import { PinCodigoEntity } from '@models/usuarios/entities/pincodigo.entity';

export class UsuarioEntity {
  readonly _id: ObjectId;
  @prop({})
  nombre!: string;
  @prop({})
  apellido!: string;
  @prop({})
  nombre_completo: string;
  @prop({})
  usuario!: string;
  @prop({ type: PinCodigoEntity, default: [] })
  claves!: PinCodigoEntity[];
  @prop({})
  direccion!: string;
  @prop({ default: [] })
  roles: string[];
  @prop({ type: CorreoEntity, default: [] })
  correos: CorreoEntity[];
  @prop({ default: true })
  activo: boolean;
  @prop({ type: AuditoriaEntity })
  auditoria: AuditoriaEntity;
}
