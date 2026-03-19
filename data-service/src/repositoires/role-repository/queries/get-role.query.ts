import { Type } from 'class-transformer';

export class GetRoleQuery {
    @Type(() => Number)
    id: number | null = null;

    @Type(() => Number)
    limit: number = 0;

    @Type(() => Number)
    offset: number = 0;
    constructor(init?: Partial<GetRoleQuery>) {
        Object.assign(this, init);
    }
}