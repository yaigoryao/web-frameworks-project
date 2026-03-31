import { IsNumber, IsString, IsOptional, MinLength, MaxLength, Length, Matches, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class OwnerGetCarsRequest {
    @ApiPropertyOptional({ description: 'Car ID', example: 1, type: Number, nullable: true })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id: number | null = null;

    @ApiPropertyOptional({ description: 'Car registration number', example: 'ABC123', type: String, nullable: true })
    @IsOptional()
    @IsString()
    @MinLength(3, { message: 'Car number must be at least 3 characters long' })
    @MaxLength(10, { message: 'Car number must not exceed 10 characters' })
    @Type(() => String)
    carNumber: string | null = null;

    @ApiPropertyOptional({ description: 'Vehicle Identification Number (17 chars)', example: 'WVWZZZ3CZ9E123456', type: String, nullable: true })
    @IsOptional()
    @IsString()
    @Length(17, 17, { message: 'VIN must be exactly 17 characters long' })
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'VIN must contain only letters and numbers' })
    @Type(() => String)
    vin: string | null = null;

    @ApiProperty({ description: 'Result limit', example: 10, default: 0 })
    @IsNumber()
    @Min(0, { message: 'Limit must be a non-negative number' })
    @Type(() => Number)
    limit: number = 0;

    @ApiProperty({ description: 'Result offset', example: 0, default: 0 })
    @IsNumber()
    @Min(0, { message: 'Offset must be a non-negative number' })
    @Type(() => Number)
    offset: number = 0;

    constructor(init?: Partial<OwnerGetCarsRequest>) {
        Object.assign(this, init);
    }
}
