import { Type } from 'class-transformer';
import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator';

export class AddOrderCommand {
    @IsNumber()
    @Type(() => Number)
    totalPrice: number = 0;

    @IsOptional()
    @IsString()
    @Type(() => String)
    description: string | null = null;

    @IsDate()
    @Type(() => Date)
    startDate: Date = new Date();

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate: Date | null = null;

    @IsDate()
    @Type(() => Date)
    plannedEndDate: Date = new Date();

    @IsNumber()
    @Type(() => Number)
    orderStatusId: number = 0;

    @IsNumber()
    @Type(() => Number)
    userId: number = 0;

    @IsNumber()
    @Type(() => Number)
    carId: number = 0;

    constructor(init?: Partial<AddOrderCommand>) {
        Object.assign(this, init);
    }
}