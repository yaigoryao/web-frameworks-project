export class UpdateOrderStatusCommand {
    id: number = 0;
    orderStatusName: string | null = null;

    constructor(init?: Partial<UpdateOrderStatusCommand>) {
        Object.assign(this, init);
    }
}