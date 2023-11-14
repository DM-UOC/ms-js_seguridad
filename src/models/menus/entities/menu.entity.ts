import { prop } from '@typegoose/typegoose';
import { ObjectId } from 'mongoose';

import { AuditoriaEntity } from '@models/auditoria/auditoria.entity';
import { SubMenuEntity } from '@models/menus/entities/submenu.entity';

export class MenuEntity {
  readonly _id: ObjectId;
  @prop({})
  descripcion!: string;
  @prop({ type: SubMenuEntity, default: [] })
  submenus?: SubMenuEntity[];
  @prop({ type: AuditoriaEntity, _id: false })
  auditoria!: AuditoriaEntity;
}
