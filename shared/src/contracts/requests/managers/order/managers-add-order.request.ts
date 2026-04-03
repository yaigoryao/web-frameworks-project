import { IsNumber, IsString, IsOptional, IsDate, Min, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class ManagersAddOrderRequest {
    @ApiProperty({ description: 'Total price', example: 100.50 })
    @IsNotEmpty({ message: 'Total price cannot be empty' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Total price must be a number with up to 2 decimal places' })
    @Min(0.01, { message: 'Total price must be greater than 0' })
    @Type(() => Number)
    totalPrice: number = 0;

    @ApiPropertyOptional({ description: 'Order description', example: 'Car rental for business trip', nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Description must not exceed 500 characters' })
    @Type(() => String)
    description: string | null = null;

    @ApiProperty({ description: 'Start date', example: '2026-03-31T10:00:00Z' })
    @IsNotEmpty({ message: 'Start date cannot be empty' })
    @IsDate({ message: 'Start date must be a valid date' })
    @Transform(({ value }) => new Date(value))
    startDate: Date = new Date();

    @ApiPropertyOptional({ description: 'End date', example: '2026-04-05T10:00:00Z', nullable: true })
    @IsOptional()
    @IsDate({ message: 'End date must be a valid date' })
    @Transform(({ value }) => value ? new Date(value) : null)
    endDate: Date | null = null;

    @ApiProperty({ description: 'Planned end date', example: '2026-04-05T10:00:00Z' })
    @IsNotEmpty({ message: 'Planned end date cannot be empty' })
    @IsDate({ message: 'Planned end date must be a valid date' })
    @Transform(({ value }) => new Date(value))
    plannedEndDate: Date = new Date();

    @ApiProperty({ description: 'Order status ID', example: 1 })
    @IsNotEmpty({ message: 'Order status ID cannot be empty' })
    @IsNumber()
    @Min(1, { message: 'Order status ID must be a positive number' })
    @Type(() => Number)
    orderStatusId: number = 0;

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

    constructor(init?: Partial<ManagersAddOrderRequest>) {
        Object.assign(this, init);
    }
}
