import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import {AuthModule} from './auth/auth.module';
import {PrismaModule} from './prisma/prisma.module';
import {UserController} from './user/user.controller';
import {UserService} from './user/user.service';
import {UserModule} from './user/user.module';
import { CarService } from './car/car.service';
import { CarModule } from './car/car.module';
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        AuthModule,
        PrismaModule,
        UserModule,
        CarModule
    ],
    controllers: [UserController],
    providers: [UserService, CarService]
})
export class AppModule {}
