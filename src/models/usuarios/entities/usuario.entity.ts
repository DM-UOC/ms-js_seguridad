import { ObjectId } from "mongoose";
import { prop } from "@typegoose/typegoose";

import { CorreoEntity } from "@models/usuarios/entities/correo.entity";
import { AuditoriaEntity } from "@models/auditoria/auditoria.entity";

export class UsuarioEntity {
  
  readonly id: ObjectId;
  @prop({})
  nombre!: string;
  @prop({})
  apellido!: string;
  @prop({})
  nombre_completo: string;
  @prop({})
  usuario!: string;  
  @prop({})
  clave!: string;
  @prop({})
  direccion!: string;
  @prop({ type: CorreoEntity, default: [] })
  correos: CorreoEntity[];
  @prop({ default: true })
  activo: boolean;
  @prop({ type: AuditoriaEntity })
  auditoria: AuditoriaEntity;

}
