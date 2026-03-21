import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
    @ApiProperty({ description: 'User password', example: 'password123' })
    declare password: string;

    @ApiProperty({ description: 'User login', example: 'user123' })
    declare login: string;
}
