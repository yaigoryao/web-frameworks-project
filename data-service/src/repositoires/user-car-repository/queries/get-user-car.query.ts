import { Type } from 'class-transformer';
import { IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class GetUserCarQuery {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    userId: number | null = null;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    carId: number | null = null;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    ownsNow: boolean | null = null;

    @IsNumber()
    @Type(() => Number)
    limit: number = 0;

    @IsNumber()
    @Type(() => Number)
    offset: number = 0;

    constructor(init?: Partial<GetUserCarQuery>) {
        Object.assign(this, init);
    }
}