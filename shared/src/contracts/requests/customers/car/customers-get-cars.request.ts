export class CustomerGetCarsRequest {
    limit: number = 0;
    offset: number = 0;

    constructor(init?: Partial<CustomerGetCarsRequest>) {
        Object.assign(this, init);
    }
}
