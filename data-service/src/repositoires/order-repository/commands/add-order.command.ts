import { Type } from 'class-transformer';

export class AddOrderCommand {
    @Type(() => Number)
    totalPrice: number = 0;

    @Type(() => String)
    description: string | null = null;

    @Type(() => Date)
    startDate: Date = new Date();

    @Type(() => Date)
    endDate: Date | null = null;

    @Type(() => Date)
    plannedEndDate: Date = new Date();

    @Type(() => Number)
    orderStatusId: number = 0;

    @Type(() => Number)
    userId: number = 0;

    @Type(() => Number)
    carId: number = 0;

    constructor(init?: Partial<AddOrderCommand>) {
        Object.assign(this, init);
    }
}