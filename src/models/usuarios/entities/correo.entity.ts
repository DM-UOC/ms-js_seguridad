import { prop } from "@typegoose/typegoose";

export class CorreoEntity {
  @prop()
  correo!: string;
  @prop({ default: false })
  principal!: boolean;
}