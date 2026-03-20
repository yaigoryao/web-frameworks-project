import { ApiProperty } from '@nestjs/swagger';

export class OrderStatusDto {
    @ApiProperty({ description: 'Order id', example: 1 })
    declare id: number;

    @ApiProperty({ description: 'Order status name', example: 'pending' })
    declare orderStatusName: string;
}