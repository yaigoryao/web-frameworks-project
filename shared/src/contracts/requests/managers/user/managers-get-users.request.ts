import { IsNumber, IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ManagersGetUsersRequest {
    @ApiPropertyOptional({ description: 'User ID', example: 1, nullable: true })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id: number | null = null;

    @ApiPropertyOptional({ description: 'User login', example: 'john_doe', nullable: true })
    @IsOptional()
    @IsString()
    @MinLength(3, { message: 'Login must be at least 3 characters long' })
    @MaxLength(50, { message: 'Login must not exceed 50 characters' })
    @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Login can only contain letters, numbers, underscore and hyphen' })
    @Type(() => String)
    login: string | null = null;

    constructor(init?: Partial<ManagersGetUsersRequest>) {
        Object.assign(this, init);
    }
}
