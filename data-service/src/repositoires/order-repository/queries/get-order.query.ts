import { Type } from 'class-transformer';

export class GetOrderQuery {
    @Type(() => Number)
    id: number = 0;

    @Type(() => Date)
    startDate: Date | null = null;

    @Type(() => Date)
    endDate: Date | null = null;

    @Type(() => Number)
    orderStatusId: number | null = null;

    @Type(() => Number)
    userId: number | null = null;

    @Type(() => String)
    userLogin: string | null = null;

    @Type(() => Number)
    limit: number = 0;

    @Type(() => Number)
    offset: number = 0;

    constructor(init?: Partial<GetOrderQuery>) {
        Object.assign(this, init);
    }
}