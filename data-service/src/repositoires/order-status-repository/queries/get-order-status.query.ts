import { Type } from 'class-transformer';

export class GetOrderStatusQuery {
    @Type(() => Number)
    id: number | null = null;

    @Type(() => Number)
    limit: number = 0;

    @Type(() => Number)
    offset: number = 0;

    constructor(init?: Partial<GetOrderStatusQuery>) {
        Object.assign(this, init);
    }
}