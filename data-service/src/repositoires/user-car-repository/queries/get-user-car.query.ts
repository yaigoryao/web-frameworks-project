export class GetUserCarQuery {
    userId: number | null = null;
    carId: number | null = null;
    ownsNow: boolean | null = null;
    limit: number = 0;
    offset: number = 0;

    constructor(init?: Partial<GetUserCarQuery>) {
        Object.assign(this, init);
    }
}