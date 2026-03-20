import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddRoleCommand {
    @ApiProperty({ description: 'Role name', example: 'Manager' })
    @IsString()
    @Type(() => String)
    roleName: string = '';

    constructor(init?: Partial<AddRoleCommand>) {
        Object.assign(this, init);
    }
}
