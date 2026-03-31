import { IsString, MinLength, MaxLength, Length, Matches, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ManagersAddCarRequest {
    @ApiProperty({ description: 'Car registration number', example: 'ABC123' })
    @IsNotEmpty({ message: 'Car number cannot be empty' })
    @IsString()
    @MinLength(3, { message: 'Car number must be at least 3 characters long' })
    @MaxLength(10, { message: 'Car number must not exceed 10 characters' })
    @Matches(/^[A-Z0-9]{3,10}$/i, { message: 'Car number must contain only letters and numbers' })
    @Type(() => String)
    carNumber: string = '';

    @ApiProperty({ description: 'Car model name', example: 'Toyota Camry' })
    @IsNotEmpty({ message: 'Model name cannot be empty' })
    @IsString()
    @MinLength(2, { message: 'Model name must be at least 2 characters long' })
    @MaxLength(100, { message: 'Model name must not exceed 100 characters' })
    @Matches(/^[a-zA-Z0-9\s-]+$/i, { message: 'Model name can only contain letters, numbers, spaces and hyphens' })
    @Type(() => String)
    modelName: string = '';

    @ApiProperty({ description: 'Vehicle Identification Number (exactly 17 chars)', example: 'WVWZZZ3CZ9E123456' })
    @IsNotEmpty({ message: 'VIN cannot be empty' })
    @IsString()
    @Length(17, 17, { message: 'VIN must be exactly 17 characters long' })
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'VIN must contain only letters and numbers' })
    @Type(() => String)
    vin: string = '';

    @ApiProperty({ description: 'Car color', example: 'Red' })
    @IsNotEmpty({ message: 'Color cannot be empty' })
    @IsString()
    @MinLength(2, { message: 'Color must be at least 2 characters long' })
    @MaxLength(50, { message: 'Color must not exceed 50 characters' })
    @Matches(/^[a-zA-Z\s]+$/i, { message: 'Color can only contain letters and spaces' })
    @Type(() => String)
    color: string = '';

    constructor(init?: Partial<ManagersAddCarRequest>) {
        Object.assign(this, init);
    }
}
