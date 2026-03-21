import { Type } from 'class-transformer';
import { Length, Matches, Min, Max, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCarCommand {
    @ApiProperty({ description: 'Car registration number', example: 'ABC123' })
    @IsString()
    @Type(() => String)
    carNumber: string = '';

    @ApiProperty({ description: 'Car model name', example: 'Toyota Camry' })
    @IsString()
    @Type(() => String)
    modelName: string = '';

    @ApiProperty({ description: 'Vehicle Identification Number (17 chars)', example: 'WVWZZZ3CZ9E123456' })
    @IsString()
    @Type(() => String)
    @Length(17, 17, { message: 'VIN must be exactly 17 characters long' })
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'VIN must contain only letters and numbers' })
    vin: string = '';

    @ApiProperty({ description: 'Car color code (0-9)', example: 1, minimum: 0, maximum: 9 })
    @IsNumber()
    @Type(() => Number)
    @Min(0, { message: 'Color must be between 0 and 9' })
    @Max(9, { message: 'Color must be between 0 and 9' })
    color: number = 9;

    constructor(init?: Partial<AddCarCommand>) {
        Object.assign(this, init);
    }
}
