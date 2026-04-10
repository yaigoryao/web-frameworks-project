import { IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OwnerDeleteOrderRequest {
    @ApiProperty({ description: 'Order ID', example: 1 })
    @IsNotEmpty({ message: 'Order ID cannot be empty' })
    @IsNumber()
    @Min(1, { message: 'Order ID must be a positive number' })
    @Type(() => Number)
    id: number = 0;

    constructor(init?: Partial<OwnerDeleteOrderRequest>) {
        Object.assign(this, init);
    }
}
