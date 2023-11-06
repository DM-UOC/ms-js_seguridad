import { ObjectId } from 'mongoose';
import { prop } from '@typegoose/typegoose';

import { AuditoriaEntity } from '@models/auditoria/auditoria.entity';

export class RoleEntity {
  readonly _id: ObjectId;
  @prop()
  description!: string;
  @prop({})
  menus!: string[];
  @prop({ type: AuditoriaEntity, _id: false })
  auditoria: AuditoriaEntity;
}
