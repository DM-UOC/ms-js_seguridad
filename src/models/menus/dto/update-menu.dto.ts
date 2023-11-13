import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuDto } from './create-menu.dto';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  readonly _id: string;
  readonly submenus: Array<CreateMenuDto>;
}
