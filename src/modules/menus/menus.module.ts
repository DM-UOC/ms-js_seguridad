import { Module } from '@nestjs/common';
import { MenusService } from '@services/menus/menus.service';
import { MenusController } from '@controllers/menus/menus.controller';

@Module({
  controllers: [MenusController],
  providers: [MenusService]
})
export class MenusModule {}
