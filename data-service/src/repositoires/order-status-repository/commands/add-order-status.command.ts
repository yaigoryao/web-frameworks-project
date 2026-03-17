export class AddOrderStatusCommand {
    orderStatusName: string = '';

    constructor(init?: Partial<AddOrderStatusCommand>) {
        Object.assign(this, init);
    }
}
