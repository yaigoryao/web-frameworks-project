import { IsNumber, IsString, IsOptional, IsDate, Min, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CustomersUpdateOrderRequest {
    @ApiProperty({ description: 'Order ID', example: 1 })
    @IsNotEmpty({ message: 'Order ID cannot be empty' })
    @IsNumber()
    @Min(1, { message: 'Order ID must be a positive number' })
    @Type(() => Number)
    id: number = 0;

    @ApiPropertyOptional({ description: 'Order status ID', example: 1, nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(1, { message: 'Order status ID must be a positive number' })
    @Type(() => Number)
    orderStatusId: number | null = null;

    @ApiPropertyOptional({ description: 'Total price', example: 100.50, nullable: true })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Total price must be a number with up to 2 decimal places' })
    @Min(0.01, { message: 'Total price must be greater than 0' })
    @Type(() => Number)
    totalPrice: number | null = null;

    @ApiPropertyOptional({ description: 'Order description', example: 'Car rental for business trip', nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Description must not exceed 500 characters' })
    @Type(() => String)
    description: string | null = null;

    @ApiPropertyOptional({ description: 'Planned end date', example: '2026-04-05T10:00:00Z', nullable: true })
    @IsOptional()
    @IsDate({ message: 'Planned end date must be a valid date' })
    @Transform(({ value }) => value ? new Date(value) : null)
    plannedEndDate: Date | null = null;

    constructor(init?: Partial<CustomersUpdateOrderRequest>) {
        Object.assign(this, init);
    }
}
