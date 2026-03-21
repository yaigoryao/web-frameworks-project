import { ApiProperty } from '@nestjs/swagger';

export class UserCarDto {
    @ApiProperty({ description: 'User ID', example: 1 })
    declare userId: number;

    @ApiProperty({ description: 'Car ID', example: 1 })
    declare carId: number;

    @ApiProperty({ description: 'Indicates if the user currently owns the car', example: true })
    declare ownsNow: boolean;

    // declare cars: CarDto[];
    // declare orders: OrderDto[];
}