import { IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ManagersDeleteUserCarRequest {
    @ApiProperty({ description: 'User ID', example: 1 })
    @IsNotEmpty({ message: 'User ID cannot be empty' })
    @IsNumber()
    @Min(1, { message: 'User ID must be a positive number' })
    @Type(() => Number)
    userId: number = 0;

    @ApiProperty({ description: 'Car ID', example: 1 })
    @IsNotEmpty({ message: 'Car ID cannot be empty' })
    @IsNumber()
    @Min(1, { message: 'Car ID must be a positive number' })
    @Type(() => Number)
    carId: number = 0;

    constructor(init?: Partial<ManagersDeleteUserCarRequest>) {
        Object.assign(this, init);
    }
}
