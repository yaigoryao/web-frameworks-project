import { IsNumber, IsString, IsOptional, IsDate, Min, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from 'class-transformer';

export class CustomerGetOrdersRequest {
    @ApiPropertyOptional({ description: 'Order start date', example: '2026-03-19T18:28:00.000+03:00', nullable: true })
    @IsOptional()
    @IsDate({ message: 'Start date must be a valid date' })
    @Transform(({ value }) => value ? new Date(value) : null)
    startDate: Date | null = null;

    @ApiPropertyOptional({ description: 'Order end date', example: '2026-03-20T18:28:00.000+03:00', nullable: true })
    @IsOptional()
    @IsDate({ message: 'End date must be a valid date' })
    @Transform(({ value }) => value ? new Date(value) : null)
    endDate: Date | null = null;

    @ApiPropertyOptional({ description: 'Order status id', example: '1', nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(1, { message: 'Order status ID must be a positive number' })
    @Type(() => Number)
    orderStatusId: number | null = null;

    @ApiProperty({ description: 'Result limit', example: 10, default: 0 })
    @IsNumber()
    @Min(0, { message: 'Limit must be a non-negative number' })
    @Type(() => Number)
    limit: number = 0;

    @ApiProperty({ description: 'Result offset', example: 10, default: 0 })
    @IsNumber()
    @Min(0, { message: 'Offset must be a non-negative number' })
    @Type(() => Number)
    offset: number = 0;

    constructor(init?: Partial<CustomerGetOrdersRequest>) {
        Object.assign(this, init);
    }
}
