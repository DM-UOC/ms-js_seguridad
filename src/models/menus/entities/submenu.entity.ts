import { prop } from '@typegoose/typegoose';
import { ObjectId } from 'mongoose';

export class SubMenuEntity {
  readonly _id: ObjectId;
  @prop({})
  descripcion: string;
  @prop({})
  enlace: string;
  @prop({})
  icono: string;
}
