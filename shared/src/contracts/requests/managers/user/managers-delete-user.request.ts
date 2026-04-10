import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ManagersDeleteUserRequest {
    @ApiProperty({ description: 'User login', example: 'john_doe' })
    @IsNotEmpty({ message: 'User login cannot be empty' })
    @IsString()
    @MinLength(3, { message: 'Login must be at least 3 characters long' })
    @MaxLength(50, { message: 'Login must not exceed 50 characters' })
    @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Login can only contain letters, numbers, underscore and hyphen' })
    @Type(() => String)
    login: string = '';

    constructor(init?: Partial<ManagersDeleteUserRequest>) {
        Object.assign(this, init);
    }
}
