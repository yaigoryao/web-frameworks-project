import { Type } from 'class-transformer';
import { IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetUserCarQuery {
    @ApiPropertyOptional({ description: 'User ID', example: 1 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    userId: number | null = null;

    @ApiPropertyOptional({ description: 'Car ID', example: 1 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    carId: number | null = null;

    @ApiPropertyOptional({ description: 'Currently owns the car', example: true })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    ownsNow: boolean | null = null;

    @ApiProperty({ description: 'Result limit', example: 10, default: 0 })
    @IsNumber()
    @Type(() => Number)
    limit: number = 0;

    @ApiProperty({ description: 'Result offset', example: 0, default: 0 })
    @IsNumber()
    @Type(() => Number)
    offset: number = 0;

    constructor(init?: Partial<GetUserCarQuery>) {
        Object.assign(this, init);
    }
}