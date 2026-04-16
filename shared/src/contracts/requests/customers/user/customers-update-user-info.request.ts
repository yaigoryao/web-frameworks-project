import { IsNumber, IsString, IsOptional, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerUpdateUserRequest {
    @ApiProperty({ description: 'User login', example: 'john_doe' })
    @IsNotEmpty({ message: 'Login cannot be empty' })
    @IsString()
    @MinLength(3, { message: 'Login must be at least 3 characters long' })
    @MaxLength(50, { message: 'Login must not exceed 50 characters' })
    @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Login can only contain letters, numbers, underscore and hyphen' })
    @Type(() => String)
    login!: string;

    @ApiPropertyOptional({ description: 'User first name', example: 'John', nullable: true })
    @IsOptional()
    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(50, { message: 'Name must not exceed 50 characters' })
    @Matches(/^[a-zA-Z\u0430-\u044f\u0410-\u042f\u0451\u0401\s'-]+$/i, { message: 'Name can only contain letters, spaces, hyphens and apostrophes' })
    @Type(() => String)
    name: string | null = null;

    @ApiPropertyOptional({ description: 'User password (if updating)', example: 'NewPassword123!', nullable: true })
    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(100, { message: 'Password must not exceed 100 characters' })
    @Type(() => String)
    password: string | null = null;

    @ApiPropertyOptional({ description: 'Current password (required when changing password)', example: 'OldPassword123!', nullable: true })
    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'Current password must be at least 6 characters long' })
    @MaxLength(100, { message: 'Current password must not exceed 100 characters' })
    @Type(() => String)
    oldPassword: string | null = null;

    @ApiPropertyOptional({ description: 'User last name', example: 'Doe', nullable: true })
    @IsOptional()
    @IsString()
    @MinLength(2, { message: 'Surname must be at least 2 characters long' })
    @MaxLength(50, { message: 'Surname must not exceed 50 characters' })
    @Matches(/^[a-zA-Z\u0430-\u044f\u0410-\u042f\u0451\u0401\s'-]+$/i, { message: 'Surname can only contain letters, spaces, hyphens and apostrophes' })
    @Type(() => String)
    surname: string | null = null;

    @ApiPropertyOptional({ description: 'User patronymic', example: 'Alexandrovich', nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(50, { message: 'Patronymic must not exceed 50 characters' })
    @Matches(/^[a-zA-Z\u0430-\u044f\u0410-\u042f\u0451\u0401\s'-]*$/, { message: 'Patronymic can only contain letters, spaces, hyphens and apostrophes' })
    @Type(() => String)
    patronymic: string | null = null;

    @ApiPropertyOptional({ description: 'User phone number', example: '+1234567890', nullable: true })
    @IsOptional()
    @IsString()
    @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be a valid E.164 format' })
    @Type(() => String)
    phoneNumber: string | null = null;

    constructor(init?: Partial<CustomerUpdateUserRequest>) {
        Object.assign(this, init);
    }
}