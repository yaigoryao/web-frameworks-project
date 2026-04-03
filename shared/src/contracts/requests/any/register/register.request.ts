import { Type } from 'class-transformer';
import { Length, Matches, IsNotEmpty, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoginRequest } from '../login/login.request';

export class RegisterRequest extends LoginRequest {
    @ApiProperty({ description: 'User login', example: 'user123' })
    @IsNotEmpty({ message: 'Login cannot be empty' })
    @IsString()
    @MinLength(3, { message: 'Login must be at least 3 characters long' })
    @MaxLength(50, { message: 'Login must not exceed 50 characters' })
    @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Login can only contain letters, numbers, underscore and hyphen' })
    @Type(() => String)
    declare login: string;

    @ApiProperty({ description: 'User name', example: 'John' })
    @IsNotEmpty({ message: 'Name cannot be empty' })
    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(50, { message: 'Name must not exceed 50 characters' })
    @Matches(/^[a-zA-Z\u0430-\u044f\u0410-\u042f\u0451\u0401\s'-]+$/, { message: 'Name can only contain letters, spaces, hyphens and apostrophes' })
    @Type(() => String)
    declare name: string;

    @ApiProperty({ description: 'User password', example: 'password123' })
    @IsNotEmpty({ message: 'Password cannot be empty' })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(100, { message: 'Password must not exceed 100 characters' })
    @Type(() => String)
    declare password: string;

    @ApiProperty({ description: 'User surname', example: 'Doe' })
    @IsNotEmpty({ message: 'Surname cannot be empty' })
    @IsString()
    @MinLength(2, { message: 'Surname must be at least 2 characters long' })
    @MaxLength(50, { message: 'Surname must not exceed 50 characters' })
    @Matches(/^[a-zA-Z\u0430-\u044f\u0410-\u042f\u0451\u0401\s'-]+$/, { message: 'Surname can only contain letters, spaces, hyphens and apostrophes' })
    @Type(() => String)
    declare surname: string;

    @ApiPropertyOptional({ description: 'User patronymic', example: 'Michael', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(50, { message: 'Patronymic must not exceed 50 characters' })
    @Matches(/^[a-zA-Z\u0430-\u044f\u0410-\u042f\u0451\u0401\s'-]*$/, { message: 'Patronymic can only contain letters, spaces, hyphens and apostrophes' })
    @Type(() => String)
    declare patronymic?: string;

    @ApiProperty({ description: 'User phone number', example: '+1234567890' })
    @IsNotEmpty({ message: 'Phone number cannot be empty' })
    @IsString()
    @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be a valid E.164 format' })
    @Type(() => String)
    declare phoneNumber: string;
}