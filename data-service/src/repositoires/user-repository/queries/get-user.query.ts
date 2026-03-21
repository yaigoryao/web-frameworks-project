import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUserQuery {
    @ApiPropertyOptional({ description: 'User ID', example: 1, type: Number, nullable: true })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id: number | null = null;

    @ApiPropertyOptional({ description: 'User login', example: 'john_doe', type: String, nullable: true })
    @IsOptional()
    @IsString()
    @Type(() => String)
    login: string | null = null;

    constructor(init?: Partial<GetUserQuery>) {
        Object.assign(this, init);
    }
}