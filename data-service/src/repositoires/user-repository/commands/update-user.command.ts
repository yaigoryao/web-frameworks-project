import { Type } from 'class-transformer';
import { MinLength, ValidateIf, IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserCommand {
    @ApiProperty({ description: 'User login', example: 'john_doe' })
    @IsString()
    @Type(() => String)
    login: string = '';

    @ApiPropertyOptional({ description: 'User password (if updating)', example: 'NewPassword123!' })
    @IsOptional()
    @IsString()
    @Type(() => String)
    password: string | null = null;

    @ApiPropertyOptional({ description: 'User first name', minLength: 3, example: 'John' })
    @IsOptional()
    @IsString()
    @Type(() => String)
    @ValidateIf((o) => o.name !== null)
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    name: string | null = null;

    @ApiPropertyOptional({ description: 'User last name', minLength: 3, example: 'Doe' })
    @IsOptional()
    @IsString()
    @Type(() => String)
    @ValidateIf((o) => o.surname !== null)
    @MinLength(3, { message: 'Surname must be at least 3 characters long' })
    surname: string | null = null;

    @ApiPropertyOptional({ description: 'User patronymic', minLength: 3, example: 'Alexandrovich' })
    @IsOptional()
    @IsString()
    @Type(() => String)
    @ValidateIf((o) => o.patronymic !== null)
    @MinLength(3, { message: 'Patronymic must be at least 3 characters long' })
    patronymic: string | null = null;

    @ApiPropertyOptional({ description: 'User is active', example: true })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    isActive: boolean | null = null;

    @ApiPropertyOptional({ description: 'User phone number', example: '+1234567890' })
    @IsOptional()
    @IsString()
    @Type(() => String)
    phoneNumber: string | null = null;

    @ApiPropertyOptional({ description: 'User role ID', example: 1 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    roleId: number | null = null;

    constructor(init?: Partial<UpdateUserCommand>) {
        Object.assign(this, init);
    }
}
