import { prop } from "@typegoose/typegoose";

import { AuditoriaEntity } from "@models/auditoria/auditoria.entity";

export class PinCodigoEntity {

  @prop({ default: 0 })
  readonly codigo!: number;
  @prop({ default: true })
  readonly ultimo!: boolean;
  @prop({ default: true })
  readonly activo!: boolean;
  @prop({ default: 0 })
  readonly intentos: number;
  @prop({ type: AuditoriaEntity })
  auditoria: AuditoriaEntity;

}