import { ImagenDto } from "@models/comun/dto/Imagen.dto";

export class ActualizaUsuarioImagenDto {
  readonly _id: string; // * "sdg24fsd5gDSasdf"
  readonly identificacion: string; // * "sdg24fsd5gDSasdf"
  readonly imagen: ImagenDto;
  readonly usuario?: string;
}
