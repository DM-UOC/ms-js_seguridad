import { prop } from '@typegoose/typegoose';
import { ObjectId } from 'mongoose';

import { AuditoriaEntity } from '@models/auditoria/auditoria.entity';

export class MenuEntity {
  readonly _id: ObjectId;
  @prop({ default: '' })
  menu_id!: string;
  @prop({ default: 0, min: 0, max: 2 })
  nivel!: number;
  @prop({})
  descripcion!: string;
  @prop({ default: '#' })
  enlace?: string;
  @prop({})
  icono?: string;
  @prop({ type: AuditoriaEntity })
  auditoria!: AuditoriaEntity;
}
