import { Type } from 'class-transformer';
import { Length, Matches, ValidateIf, IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Параметры GET /customer/car.
 * Список всегда ограничен текущим пользователем по JWT; поле userId отсутствует намеренно.
 */
export class CustomerGetCarQuery {
    @ApiPropertyOptional({ description: 'Car ID', example: 1, type: Number, nullable: true })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id: number | null = null;

    @ApiPropertyOptional({ description: 'Car registration number', example: 'ABC123', type: String, nullable: true })
    @IsOptional()
    @IsString()
    @Type(() => String)
    carNumber: string | null = null;

    @ApiPropertyOptional({ description: 'VIN (17 chars)', example: 'WVWZZZ3CZ9E123456', type: String, nullable: true })
    @IsOptional()
    @IsString()
    @Type(() => String)
    @ValidateIf((o) => o.vin !== null)
    @Length(17, 17, { message: 'VIN must be exactly 17 characters long' })
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'VIN must contain only letters and numbers' })
    vin: string | null = null;

    @ApiProperty({ description: 'Result limit', example: 10, default: 0 })
    @IsNumber()
    @Type(() => Number)
    limit: number = 0;

    @ApiProperty({ description: 'Result offset', example: 0, default: 0 })
    @IsNumber()
    @Type(() => Number)
    offset: number = 0;

    constructor(init?: Partial<CustomerGetCarQuery>) {
        Object.assign(this, init);
    }
}
