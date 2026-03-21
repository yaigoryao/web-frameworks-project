import { Type } from 'class-transformer';
import { Length, Matches, Min, Max, IsNumber, ValidateIf, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCarCommand {
    @ApiProperty({ description: 'Car ID to update', example: 1 })
    @IsNumber()
    @Type(() => Number)
    id: number = 0;

    @ApiPropertyOptional({ description: 'Car registration number', example: 'ABC123', type: String, nullable: true })
    @IsOptional()
    @IsString()
    @Type(() => String)
    carNumber: string | null = null;

    @ApiPropertyOptional({ description: 'Car model name', example: 'Toyota Camry', type: String, nullable: true })
    @IsOptional()
    @IsString()
    @Type(() => String)
    modelName: string | null = null;

    @ApiPropertyOptional({ description: 'Vehicle Identification Number (17 chars)', example: 'WVWZZZ3CZ9E123456', type: String, nullable: true })
    @IsOptional()
    @IsString()
    @Type(() => String)
    @ValidateIf((o) => o.vin !== null)
    @Length(17, 17, { message: 'VIN must be exactly 17 characters long' })
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'VIN must contain only letters and numbers' })
    vin: string | null = null;

    @ApiPropertyOptional({ description: 'Car color code (0-9)', example: 1, minimum: 0, maximum: 9, type: String, nullable: true })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ValidateIf((o) => o.color !== null)
    @Min(0, { message: 'Color must be between 0 and 9' })
    @Max(9, { message: 'Color must be between 0 and 9' })
    color: number | null = null;

    constructor(init?: Partial<UpdateCarCommand>) {
        Object.assign(this, init);
    }
}