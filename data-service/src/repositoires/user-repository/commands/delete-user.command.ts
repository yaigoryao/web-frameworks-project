import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserCommand {
    @ApiProperty({ description: 'User login to delete', example: 'john_doe' })
    @IsString()
    @Type(() => String)
    login: string = '';

    constructor(init?: Partial<DeleteUserCommand>) {
        Object.assign(this, init);
    }
}