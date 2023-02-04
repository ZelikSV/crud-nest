import {Body, Controller, Get, Param, Patch, Post} from '@nestjs/common';

import {CarService} from './car.service';
import {CreateCarArgs} from './dto';

@Controller('car')
export class CarController {
    constructor(private carService: CarService) {}
    @Get(':id')
    getCarById(@Param('id') id: string) {
        return this.carService.getCarById(id);
    }

    @Post('create')
    setCar(@Body() dto: CreateCarArgs) {
        return this.carService.setCar(dto);
    }

    @Patch('update/:id')
    updateCarById(@Param('id') id: string, @Body() dto: CreateCarArgs) {
        return this.carService.updateCarById(id, dto);
    }

    @Post('delete/:id')
    removeCarById(@Param('id') id: string) {
        return this.carService.removeCarById(id);
    }
}
