import { Type } from 'class-transformer';
import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddOrderCommand {
    @ApiProperty({ description: 'Total order price', example: 1500.50 })
    @IsNumber()
    @Type(() => Number)
    totalPrice: number = 0;

    @ApiPropertyOptional({ description: 'Order description', example: 'Car rental for business trip', type: String, nullable: true })
    @IsOptional()
    @IsString()
    @Type(() => String)
    description: string | null = null;

    @ApiProperty({ description: 'Order start date', example: '2024-01-01T00:00:00Z' })
    @IsDate()
    @Type(() => Date)
    startDate: Date = new Date();

    @ApiPropertyOptional({ description: 'Order actual end date', example: '2024-01-31T23:59:59Z', type: Date, nullable: true })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate: Date | null = null;

    @ApiProperty({ description: 'Order planned end date', example: '2024-01-15T00:00:00Z' })
    @IsDate()
    @Type(() => Date)
    plannedEndDate: Date = new Date();

    @ApiProperty({ description: 'Order status ID', example: 1 })
    @IsNumber()
    @Type(() => Number)
    orderStatusId: number = 0;

    @ApiProperty({ description: 'User ID', example: 1 })
    @IsNumber()
    @Type(() => Number)
    userId: number = 0;

    @ApiProperty({ description: 'Car ID', example: 1 })
    @IsNumber()
    @Type(() => Number)
    carId: number = 0;

    constructor(init?: Partial<AddOrderCommand>) {
        Object.assign(this, init);
    }
}