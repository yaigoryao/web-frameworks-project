import { Type } from 'class-transformer';

export class GetCarQuery {
    @Type(() => Number)
    id: number | null = null;

    @Type(() => String)
    carNumber: string | null = null;

    @Type(() => String)
    vin: string | null = null;

    @Type(() => Number)
    limit: number = 0;

    @Type(() => Number)
    offset: number = 0;

    @Type(() => Number)
    userId: number | null = null;

    constructor(init?: Partial<GetCarQuery>) {
        Object.assign(this, init);
    }
}