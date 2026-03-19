import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateRoleCommand {
    @IsNumber()
    @Type(() => Number)
    id: number = 0;

    @IsOptional()
    @IsString()
    @Type(() => String)
    roleName: string | null = null;

    constructor(init?: Partial<UpdateRoleCommand>) {
        Object.assign(this, init);
    }
}