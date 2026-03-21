import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
    @ApiProperty({ description: 'Role ID', example: 1 })
    declare id: number;

    @ApiProperty({ description: 'Name of the role', example: 'admin' })
    declare roleName: string;

    @ApiProperty({ description: 'Description of the role', example: 'Administrator role with full access' })
    declare description: string;
}