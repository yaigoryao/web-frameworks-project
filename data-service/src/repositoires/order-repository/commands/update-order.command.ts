import { Type } from 'class-transformer';
import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderCommand {
    @ApiProperty({ description: 'Order ID to update', example: 1 })
    @IsNumber()
    @Type(() => Number)
    id: number = 0;

    @ApiPropertyOptional({ description: 'Order start date', example: '2024-01-01T00:00:00Z' })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startDate: Date | null = null;

    @ApiPropertyOptional({ description: 'Order actual end date', example: '2024-01-31T23:59:59Z' })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate: Date | null = null;

    @ApiPropertyOptional({ description: 'Order planned end date', example: '2024-01-15T00:00:00Z' })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    plannedEndDate: Date | null = null;

    @ApiPropertyOptional({ description: 'Order status ID', example: 1 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    orderStatusId: number | null = null;

    @ApiPropertyOptional({ description: 'Total order price', example: 1500.50 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    totalPrice: number | null = null;

    @ApiPropertyOptional({ description: 'Order description', example: 'Car rental for business trip' })
    @IsOptional()
    @IsString()
    @Type(() => String)
    description: string | null = null;

    constructor(init?: Partial<UpdateOrderCommand>) {
        Object.assign(this, init);
    }
}