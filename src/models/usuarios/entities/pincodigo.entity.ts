import { prop } from '@typegoose/typegoose';

import { AuditoriaEntity } from '@models/auditoria/auditoria.entity';

export class PinCodigoEntity {
  @prop({ default: '' })
  readonly codigo!: string;
  @prop({ default: true })
  readonly activo!: boolean;
  @prop({ default: 0 })
  readonly intento: number;
  @prop({ type: AuditoriaEntity, _id: false })
  auditoria: AuditoriaEntity;
}
