export class CustomerGetOrdersRequest {
    startDate: Date | null = null;
    endDate: Date | null = null;
    orderStatusId: number | null = null;
    limit: number = 0;
    offset: number = 0;

    constructor(init?: Partial<CustomerGetOrdersRequest>) {
        Object.assign(this, init);
    }
}
