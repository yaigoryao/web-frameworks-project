import { Type } from 'class-transformer';
import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator';

export class GetOrderQuery {
    @IsNumber()
    @Type(() => Number)
    id: number = 0;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startDate: Date | null = null;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate: Date | null = null;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    orderStatusId: number | null = null;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    userId: number | null = null;

    @IsOptional()
    @IsString()
    @Type(() => String)
    userLogin: string | null = null;

    @IsNumber()
    @Type(() => Number)
    limit: number = 0;

    @IsNumber()
    @Type(() => Number)
    offset: number = 0;

    constructor(init?: Partial<GetOrderQuery>) {
        Object.assign(this, init);
    }
}