export class GetOrderStatusQuery {
    id: number = 0;

    constructor(init?: Partial<GetOrderStatusQuery>) {
        Object.assign(this, init);
    }
}