import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { UsuarioEntity } from '@models/usuarios/entities/usuario.entity';

import config from '@app/libs/config/config';

@Module({
    imports: [
    ],
    exports: [
      
    ],
    controllers: [],
    providers: []
})
export class UsuarioModule {}