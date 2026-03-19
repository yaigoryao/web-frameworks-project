import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetUserQuery {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id: number | null = null;

    @IsOptional()
    @IsString()
    @Type(() => String)
    login: string | null = null;

    constructor(init?: Partial<GetUserQuery>) {
        Object.assign(this, init);
    }
}