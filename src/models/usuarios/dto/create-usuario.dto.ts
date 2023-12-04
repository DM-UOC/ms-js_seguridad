export class CreateUsuarioDto {
  readonly identificacion!: string;
  readonly nombre_completo!: string;
  readonly direccion!: string;
  readonly telefonos?: string[];
  readonly fecha_desde?: Date;
  readonly usuario?: string;
}
