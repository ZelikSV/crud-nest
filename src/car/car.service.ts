import {ForbiddenException, Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateCarArgs} from './dto';

@Injectable()
export class CarService {
    constructor(private prisma: PrismaService) {}

    async getCarById(id: string) {
        try {
            const selectedCar = await this.prisma.car.findUnique({
                where: {
                    id: Number(id)
                }
            });

            if (!selectedCar) {
                throw new ForbiddenException('Car data does not exist');
            }

            return selectedCar;
        } catch (error) {
            throw error;
        }
    }

    async updateCarById(carId: string, car: Partial<CreateCarArgs>) {
        try {
            const updatedCar = await this.prisma.car.update({
                where: {
                    id: Number(carId)
                },
                data: car
            });

            if (!updatedCar) {
                throw new ForbiddenException('Car data did not updated');
            }

            return updatedCar;
        } catch (error) {
            throw error;
        }
    }

    async setCar(dto: CreateCarArgs) {
        try {
            const createdCar = await this.prisma.car.create({
                data: {...dto}
            });

            if (!createdCar) {
                throw new ForbiddenException('Car did not created');
            }

            return createdCar;
        } catch (error) {
            throw error;
        }
    }

    async removeCarById(id: string) {
        try {
            const deletedCar = await this.prisma.car.delete({
                where: {
                    id: Number(id)
                }
            });

            if (!deletedCar) {
                throw new ForbiddenException('Car did not created');
            }

            return deletedCar;
        } catch (error) {
            throw error;
        }
    }
}
