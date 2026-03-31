import { IsString, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerGetUserInfoRequest {
    @ApiProperty({ description: 'User login', example: 'john_doe' })
    @IsNotEmpty({ message: 'Login cannot be empty' })
    @IsString()
    @MinLength(3, { message: 'Login must be at least 3 characters long' })
    @MaxLength(50, { message: 'Login must not exceed 50 characters' })
    @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Login can only contain letters, numbers, underscore and hyphen' })
    @Type(() => String)
    login: string = '';

    constructor(init?: Partial<CustomerGetUserInfoRequest>) {
        Object.assign(this, init);
    }
}

// Legacy interface (kept for reference)
// export interface IGetUserInfoRequest {
//     login: string;
// }