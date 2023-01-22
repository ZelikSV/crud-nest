import {ForbiddenException, Injectable} from '@nestjs/common';

import {PrismaService} from '../prisma/prisma.service';
import {EditUserDto} from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async editUserById(userId: number, dto: EditUserDto) {
        try {
            const updatedUser = await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    ...dto
                }
            });

            if (!updatedUser) {
                throw new ForbiddenException('User data does not updated');
            }

            delete updatedUser.hash;

            return updatedUser;
        } catch (error) {
            throw error;
        }
    }
}
