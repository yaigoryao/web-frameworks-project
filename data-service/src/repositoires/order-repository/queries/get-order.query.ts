export class GetOrderQuery {
    id: number = 0;
    startDate: Date | null = null;
    endDate: Date | null = null;
    orderStatusId: number | null = null;
    userId: number | null = null;
    userLogin: string | null = null;
    limit: number = 0;
    offset: number = 0;

    constructor(init?: Partial<GetOrderQuery>) {
        Object.assign(this, init);
    }
}