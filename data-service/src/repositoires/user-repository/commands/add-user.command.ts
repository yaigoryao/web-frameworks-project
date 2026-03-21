import { Type } from 'class-transformer';
import { MinLength, ValidateIf, IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddUserCommand {
    @ApiProperty({ description: 'User login', minLength: 3, example: 'john_doe' })
    @IsString()
    @Type(() => String)
    login: string = '';

    @ApiProperty({ description: 'User password', example: 'SecurePassword123!' })
    @IsString()
    @Type(() => String)
    password: string = '';

    @ApiProperty({ description: 'Password salt', example: 'saltvalue' })
    @IsString()
    @Type(() => String)
    salt: string = '';

    @ApiProperty({ description: 'Refresh token', example: 'eyJhbGc...' })
    @IsString()
    @Type(() => String)
    refreshToken: string = '';

    @ApiProperty({ description: 'User first name', minLength: 3, example: 'John' })
    @IsString()
    @Type(() => String)
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    name: string = '';

    @ApiProperty({ description: 'User last name', minLength: 3, example: 'Doe' })
    @IsString()
    @Type(() => String)
    @MinLength(3, { message: 'Surname must be at least 3 characters long' })
    surname: string = '';

    @ApiPropertyOptional({ description: 'User patronymic', minLength: 3, example: 'Alexandrovich', type: String, nullable: true  })
    @IsOptional()
    @IsString()
    @Type(() => String)
    @ValidateIf((o) => o.patronymic !== null)
    @MinLength(3, { message: 'Patronymic must be at least 3 characters long' })
    patronymic: string | null = null;

    @ApiProperty({ description: 'User phone number', example: '+1234567890' })
    @IsString()
    @Type(() => String)
    phoneNumber: string = '';

    @ApiProperty({ description: 'User is active', default: true, example: true })
    @IsBoolean()
    @Type(() => Boolean)
    isActive: boolean = true;

    @ApiProperty({ description: 'User role ID', example: 1 })
    @IsNumber()
    @Type(() => Number)
    roleId: number = 0;

    constructor(init?: Partial<AddUserCommand>) {
        Object.assign(this, init);
    }
}
