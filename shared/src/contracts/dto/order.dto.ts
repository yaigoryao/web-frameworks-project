import { ApiProperty } from '@nestjs/swagger';
import { CarDto } from "./car.dto";
import { OrderStatusDto } from "./order-status.dto";

export class OrderDto {
    @ApiProperty({ description: 'Order ID', example: 1 })
    declare id: number;

    @ApiProperty({ description: 'Total price of the order', example: 100 })
    declare totalPrice: number;

    @ApiProperty({ description: 'Description of the order', example: 'Order for a new car' })
    declare description: string;

    @ApiProperty({ description: 'Start date of the order', example: '2023-10-01T00:00:00Z' })
    declare startDate: Date;

    @ApiProperty({ description: 'End date of the order', example: '2023-10-31T00:00:00Z' })
    declare endDate: Date;

    @ApiProperty({ description: 'Planned end date of the order', example: '2023-11-30T00:00:00Z' })
    declare plannedEndDate: Date;

    @ApiProperty({ description: 'ID of the order status', example: 1 })
    declare orderStatusId: number;

    @ApiProperty({ description: 'Order status details', example: { id: 1, orderStatusName: 'Pending' } })
    declare orderStatus: OrderStatusDto;

    @ApiProperty({ description: 'ID of the car', example: 1 })
    declare carId: number;

    @ApiProperty({ description: 'Car details', example: { id: 1, make: 'Toyota', model: 'Corolla' } })
    declare car: CarDto;

    @ApiProperty({ description: 'User ID', example: 1 })
    declare userId: number;
}

