import { prop } from '@typegoose/typegoose';

import { AuditoriaEntity } from '@models/auditoria/auditoria.entity';

export class CorreoEntity {
  @prop()
  correo!: string;
  @prop({ default: false })
  principal!: boolean;
  @prop({ type: AuditoriaEntity, _id: false })
  auditoria: AuditoriaEntity;
}
