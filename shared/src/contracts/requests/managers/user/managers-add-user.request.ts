import { IsNumber, IsString, IsOptional, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ManagersAddUserRequest {
    @ApiProperty({ description: 'User login', example: 'john_doe' })
    @IsNotEmpty({ message: 'Login cannot be empty' })
    @IsString()
    @MinLength(3, { message: 'Login must be at least 3 characters long' })
    @MaxLength(50, { message: 'Login must not exceed 50 characters' })
    @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Login can only contain letters, numbers, underscore and hyphen' })
    @Type(() => String)
    login: string = '';

    @ApiProperty({ description: 'User password', example: 'password123' })
    @IsNotEmpty({ message: 'Password cannot be empty' })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(100, { message: 'Password must not exceed 100 characters' })
    @Type(() => String)
    password: string = '';

    @ApiProperty({ description: 'User first name', example: 'John' })
    @IsNotEmpty({ message: 'Name cannot be empty' })
    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(50, { message: 'Name must not exceed 50 characters' })
    @Matches(/^[a-zA-Z\u0430-\u044f\u0410-\u042f\u0451\u0401\s'-]+$/i, { message: 'Name can only contain letters, spaces, hyphens and apostrophes' })
    @Type(() => String)
    name: string = '';

    @ApiProperty({ description: 'User last name', example: 'Doe' })
    @IsNotEmpty({ message: 'Surname cannot be empty' })
    @IsString()
    @MinLength(2, { message: 'Surname must be at least 2 characters long' })
    @MaxLength(50, { message: 'Surname must not exceed 50 characters' })
    @Matches(/^[a-zA-Z\u0430-\u044f\u0410-\u042f\u0451\u0401\s'-]+$/i, { message: 'Surname can only contain letters, spaces, hyphens and apostrophes' })
    @Type(() => String)
    surname: string = '';

    @ApiPropertyOptional({ description: 'User patronymic', example: 'Alexandrovich', nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(50, { message: 'Patronymic must not exceed 50 characters' })
    @Matches(/^[a-zA-Z\u0430-\u044f\u0410-\u042f\u0451\u0401\s'-]*$/, { message: 'Patronymic can only contain letters, spaces, hyphens and apostrophes' })
    @Type(() => String)
    patronymic: string | null = null;

    @ApiProperty({ description: 'User phone number', example: '+1234567890' })
    @IsNotEmpty({ message: 'Phone number cannot be empty' })
    @IsString()
    @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be a valid E.164 format' })
    @Type(() => String)
    phoneNumber: string = '';

    @ApiProperty({ description: 'User role ID', example: 1 })
    @IsNotEmpty({ message: 'Role ID cannot be empty' })
    @IsNumber()
    @Type(() => Number)
    roleId: number = 0;

    constructor(init?: Partial<ManagersAddUserRequest>) {
        Object.assign(this, init);
    }
}
