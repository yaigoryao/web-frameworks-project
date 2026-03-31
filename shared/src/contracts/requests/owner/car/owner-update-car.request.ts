import { IsNumber, IsString, IsOptional, MinLength, MaxLength, Length, Matches, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OwnerUpdateCarRequest {
    @ApiProperty({ description: 'Car ID', example: 1 })
    @IsNotEmpty({ message: 'Car ID cannot be empty' })
    @IsNumber()
    @Type(() => Number)
    id: number = 0;

    @ApiPropertyOptional({ description: 'Car registration number', example: 'ABC123', nullable: true })
    @IsOptional()
    @IsString()
    @MinLength(3, { message: 'Car number must be at least 3 characters long' })
    @MaxLength(10, { message: 'Car number must not exceed 10 characters' })
    @Matches(/^[A-Z0-9]{3,10}$/i, { message: 'Car number must contain only letters and numbers' })
    @Type(() => String)
    carNumber: string | null = null;

    @ApiPropertyOptional({ description: 'Car model name', example: 'Toyota Camry', nullable: true })
    @IsOptional()
    @IsString()
    @MinLength(2, { message: 'Model name must be at least 2 characters long' })
    @MaxLength(100, { message: 'Model name must not exceed 100 characters' })
    @Matches(/^[a-zA-Z0-9\s-]+$/i, { message: 'Model name can only contain letters, numbers, spaces and hyphens' })
    @Type(() => String)
    modelName: string | null = null;

    @ApiPropertyOptional({ description: 'Vehicle Identification Number (exactly 17 chars)', example: 'WVWZZZ3CZ9E123456', nullable: true })
    @IsOptional()
    @IsString()
    @Length(17, 17, { message: 'VIN must be exactly 17 characters long' })
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'VIN must contain only letters and numbers' })
    @Type(() => String)
    vin: string | null = null;

    @ApiPropertyOptional({ description: 'Car color', example: 'Red', nullable: true })
    @IsOptional()
    @IsString()
    @MinLength(2, { message: 'Color must be at least 2 characters long' })
    @MaxLength(50, { message: 'Color must not exceed 50 characters' })
    @Matches(/^[a-zA-Z\s]+$/i, { message: 'Color can only contain letters and spaces' })
    @Type(() => String)
    color: string | null = null;

    constructor(init?: Partial<OwnerUpdateCarRequest>) {
        Object.assign(this, init);
    }
}
