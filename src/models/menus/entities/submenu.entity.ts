import { prop } from '@typegoose/typegoose';
import { ObjectId } from 'mongoose';

export class SubMenuEntity {
  readonly _id: ObjectId;
  @prop({ uppercase: true })
  descripcion: string;
  @prop({ lowercase: true })
  enlace: string;
  @prop({ lowercase: true })
  icono: string;
}
