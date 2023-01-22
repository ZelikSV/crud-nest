import {Body, Controller, Get, Patch, UseGuards} from '@nestjs/common';
import {User} from '@prisma/client';

import {UserService} from './user.service';
import {EditUserDto} from './dto';
import {GetUser} from './decorator';
import {JwtGuard} from '../auth/guard';

@Controller('user')
export class UserController {
    constructor(private user: UserService) {}

    @UseGuards(JwtGuard)
    @Get('me')
    getUser(@GetUser() user: User) {
        return user;
    }

    @UseGuards(JwtGuard)
    @Patch('update/:id')
    editUser(@GetUser('id') id: number, @Body() dto: EditUserDto) {
        return this.user.editUserById(id, dto);
    }
}
