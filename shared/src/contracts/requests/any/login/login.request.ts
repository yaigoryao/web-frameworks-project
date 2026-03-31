import { Type } from 'class-transformer';
import { Length, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
    @ApiProperty({ description: 'User password', example: 'password123' })
    @IsNotEmpty({ message: 'Password cannot be empty' })
    @IsString()
    @Type(() => String)
    @Length(3, 100, { message: 'Password must be at least 3 characters long' })
    declare password: string;

    @ApiProperty({ description: 'User login', example: 'user123' })
    @IsNotEmpty({ message: 'Login cannot be empty' })
    @IsString()
    @Type(() => String)
    @Length(3, 100, { message: 'Login must be at least 3 characters long' })
    declare login: string;
}