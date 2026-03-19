import { Type } from 'class-transformer';

export class UpdateOrderCommand {
    @Type(() => Number)
    id: number = 0;

    @Type(() => Date)
    startDate: Date | null = null;

    @Type(() => Date)
    endDate: Date | null = null;

    @Type(() => Date)
    plannedEndDate: Date | null = null;

    @Type(() => Number)
    orderStatusId: number | null = null;

    @Type(() => Number)
    totalPrice: number | null = null;

    @Type(() => String)
    description: string | null = null;

    constructor(init?: Partial<UpdateOrderCommand>) {
        Object.assign(this, init);
    }
}