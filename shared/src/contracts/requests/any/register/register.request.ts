import { ApiProperty } from '@nestjs/swagger';
import { LoginRequest } from '../login/login.request';

export class RegisterRequest extends LoginRequest {
    @ApiProperty({ description: 'User login', example: 'user123' })
    declare login: string;

    @ApiProperty({ description: 'User name', example: 'John' })
    declare name: string;

    @ApiProperty({ description: 'User password', example: 'password123' })
    declare password: string;

    @ApiProperty({ description: 'User surname', example: 'Doe' })
    declare surname: string;

    @ApiProperty({ description: 'User patronymic', example: 'Michael', required: false })
    declare patronymic?: string;

    @ApiProperty({ description: 'User phone number', example: '+1234567890' })
    declare phoneNumber: string;
}

