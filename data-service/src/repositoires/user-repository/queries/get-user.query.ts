import { Type } from 'class-transformer';

export class GetUserQuery {
    @Type(() => Number)
    id: number | null = null;

    @Type(() => String)
    login: string | null = null;

    constructor(init?: Partial<GetUserQuery>) {
        Object.assign(this, init);
    }
}