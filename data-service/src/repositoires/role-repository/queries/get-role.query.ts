import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetRoleQuery {
    @ApiPropertyOptional({ description: 'Role ID', example: 1 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id: number | null = null;

    @ApiProperty({ description: 'Result limit', example: 10, default: 0 })
    @IsNumber()
    @Type(() => Number)
    limit: number = 0;

    @ApiProperty({ description: 'Result offset', example: 0, default: 0 })
    @IsNumber()
    @Type(() => Number)
    offset: number = 0;
    constructor(init?: Partial<GetRoleQuery>) {
        Object.assign(this, init);
    }
}