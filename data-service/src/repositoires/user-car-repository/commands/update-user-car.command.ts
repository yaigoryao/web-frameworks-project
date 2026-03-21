import { Type } from 'class-transformer';
import { IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserCarCommand {
    @ApiProperty({ description: 'User ID', example: 1 })
    @IsNumber()
    @Type(() => Number)
    userId: number = 0;

    @ApiProperty({ description: 'Car ID', example: 1 })
    @IsNumber()
    @Type(() => Number)
    carId: number = 0;

    @ApiProperty({ description: 'User currently owns this car', default: true, example: true })
    @IsBoolean()
    @Type(() => Boolean)
    ownsNow: boolean = true;

    constructor(init?: Partial<UpdateUserCarCommand>) {
        Object.assign(this, init);
    }
}