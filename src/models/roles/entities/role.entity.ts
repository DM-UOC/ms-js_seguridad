import { ObjectId } from 'mongoose';
import { prop } from '@typegoose/typegoose';

import { AuditoriaEntity } from '@models/auditoria/auditoria.entity';

export class RoleEntity {
  readonly _id: ObjectId;
  @prop()
  description!: string;
  @prop({})
  menus!: string[];
  @prop({ default: true })
  activo: boolean;
  @prop({ type: AuditoriaEntity })
  auditoria: AuditoriaEntity;
}
