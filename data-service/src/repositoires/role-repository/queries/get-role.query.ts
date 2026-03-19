import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetRoleQuery {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id: number | null = null;

    @IsNumber()
    @Type(() => Number)
    limit: number = 0;

    @IsNumber()
    @Type(() => Number)
    offset: number = 0;
    constructor(init?: Partial<GetRoleQuery>) {
        Object.assign(this, init);
    }
}