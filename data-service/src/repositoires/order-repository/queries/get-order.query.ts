import { Type } from 'class-transformer';
import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetOrderQuery {
    @ApiProperty({ description: 'Order ID', example: 1, default: 0 })
    @IsNumber()
    @Type(() => Number)
    id: number = 0;

    @ApiPropertyOptional({ description: 'Order start date', example: '2024-01-01T00:00:00Z', type: Date, nullable: true })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startDate: Date | null = null;

    @ApiPropertyOptional({ description: 'Order end date', example: '2024-01-31T23:59:59Z', type: Date, nullable: true })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate: Date | null = null;

    @ApiPropertyOptional({ description: 'Order status ID', example: 1, type: Number, nullable: true })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    orderStatusId: number | null = null;

    @ApiPropertyOptional({ description: 'User ID filter', example: 1, type: Number, nullable: true })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    userId: number | null = null;

    @ApiPropertyOptional({ description: 'User login filter', example: 'john_doe', type: String, nullable: true })
    @IsOptional()
    @IsString()
    @Type(() => String)
    userLogin: string | null = null;

    @ApiProperty({ description: 'Result limit', example: 10, default: 0 })
    @IsNumber()
    @Type(() => Number)
    limit: number = 0;

    @ApiProperty({ description: 'Result offset', example: 0, default: 0 })
    @IsNumber()
    @Type(() => Number)
    offset: number = 0;

    constructor(init?: Partial<GetOrderQuery>) {
        Object.assign(this, init);
    }
}