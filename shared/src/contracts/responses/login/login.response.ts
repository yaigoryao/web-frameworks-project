import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsJWT } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
    @ApiProperty({ description: 'Access token for authentication', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' })
    @IsNotEmpty({ message: 'Access token cannot be empty' })
    @IsString()
    @IsJWT()
    @Type(() => String)
    declare accessToken: string;

    @ApiProperty({ description: 'Refresh token for obtaining a new access token', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty({ message: 'Refresh token cannot be empty' })
    @IsString()
    @Type(() => String)
    declare refreshToken: string;
}