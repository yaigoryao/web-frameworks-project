import { ApiProperty } from '@nestjs/swagger';

export class UserJwtData {
    @ApiProperty({ description: 'User login', example: 'user123' })
    declare login: string;

    @ApiProperty({ description: 'User role', example: 'manager' })
    declare role: string;
}