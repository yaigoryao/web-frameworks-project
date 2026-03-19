import { Type } from 'class-transformer';
import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator';

export class UpdateOrderCommand {
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
    @IsDate()
    @Type(() => Date)
    plannedEndDate: Date | null = null;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    orderStatusId: number | null = null;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    totalPrice: number | null = null;

    @IsOptional()
    @IsString()
    @Type(() => String)
    description: string | null = null;

    constructor(init?: Partial<UpdateOrderCommand>) {
        Object.assign(this, init);
    }
}