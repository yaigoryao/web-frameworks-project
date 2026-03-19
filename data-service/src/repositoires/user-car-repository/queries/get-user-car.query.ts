import { Type } from 'class-transformer';

export class GetUserCarQuery {
    @Type(() => Number)
    userId: number | null = null;

    @Type(() => Number)
    carId: number | null = null;

    @Type(() => Boolean)
    ownsNow: boolean | null = null;

    @Type(() => Number)
    limit: number = 0;

    @Type(() => Number)
    offset: number = 0;

    constructor(init?: Partial<GetUserCarQuery>) {
        Object.assign(this, init);
    }
}