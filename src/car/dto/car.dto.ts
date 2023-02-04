import {IsNumber, IsOptional, IsString} from 'class-validator';
import {Type} from 'class-transformer';

export class CreateCarArgs {
    @IsString()
    model: string;
    @Type(() => Number)
    @IsNumber()
    mileage: number;
    @IsString()
    @IsOptional()
    transmission: string | undefined;
    @IsOptional()
    @Type(() => Number)
    ownerId: number | undefined;
}
