import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRoleCommand {
    @ApiProperty({ description: 'Role ID to update', example: 1 })
    @IsNumber()
    @Type(() => Number)
    id: number = 0;

    @ApiPropertyOptional({ description: 'Role name', example: 'Manager', type: String, nullable: true })
    @IsOptional()
    @IsString()
    @Type(() => String)
    roleName: string | null = null;

    constructor(init?: Partial<UpdateRoleCommand>) {
        Object.assign(this, init);
    }
}