import { Type } from 'class-transformer';
import { Length, Matches, IsNotEmpty, IsString, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginRequest } from '../login/login.request';

export class RegisterRequest extends LoginRequest {
    @ApiProperty({ description: 'User login', example: 'user123' })
    @IsNotEmpty({ message: 'Login cannot be empty' })
    @IsString()
    @Type(() => String)
    @Length(3, 100, { message: 'Login must be at least 3 characters long' })
    declare login: string;

    @ApiProperty({ description: 'User name', example: 'John' })
    @IsNotEmpty({ message: 'Name cannot be empty' })
    @IsString()
    @Type(() => String)
    @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
    @Matches(/^[A-Za-zА-Яа-яЁё\s\-]+$/, { message: 'Name can only contain letters, spaces and hyphens' })
    declare name: string;

    @ApiProperty({ description: 'User password', example: 'password123' })
    @IsNotEmpty({ message: 'Password cannot be empty' })
    @IsString()
    @Type(() => String)
    @Length(6, 100, { message: 'Password must be between 6 and 100 characters' })
    @Matches(/^\S+$/, { message: 'Password cannot contain spaces or whitespace characters' })
    declare password: string;

    @ApiProperty({ description: 'User surname', example: 'Doe' })
    @IsNotEmpty({ message: 'Surname cannot be empty' })
    @IsString()
    @Type(() => String)
    @Length(2, 50, { message: 'Surname must be between 2 and 50 characters' })
    @Matches(/^[A-Za-zА-Яа-яЁё\s\-]+$/, { message: 'Surname can only contain letters, spaces and hyphens' })
    declare surname: string;

    @ApiProperty({ description: 'User patronymic', example: 'Michael', required: false })
    @IsOptional()
    @IsString()
    @Type(() => String)
    @Length(2, 50, { message: 'Patronymic must be between 2 and 50 characters' })
    @Matches(/^[A-Za-zА-Яа-яЁё\s\-]+$/, { message: 'Patronymic can only contain letters, spaces and hyphens' })
    declare patronymic?: string;

    @ApiProperty({ description: 'User phone number', example: '+1234567890' })
    @IsNotEmpty({ message: 'Phone number cannot be empty' })
    @IsString()
    @Type(() => String)
    @IsPhoneNumber(undefined, { message: 'Invalid phone number format' })
    declare phoneNumber: string;
}