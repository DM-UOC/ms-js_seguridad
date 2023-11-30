export class CreateUsuarioDto {
  readonly identificacion!: string;
  readonly nombre_completo!: string;
  readonly direccion!: string;
  readonly telefonos?: string[];
  readonly usuario?: string;
}
