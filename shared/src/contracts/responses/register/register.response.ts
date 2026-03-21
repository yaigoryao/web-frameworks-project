import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponse {
    @ApiProperty({ description: 'User login', example: 'user123' })
    declare login: string;
}
