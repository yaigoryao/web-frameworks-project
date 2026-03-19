import { Type } from 'class-transformer';

export class AddOrderStatusCommand {
    @Type(() => String)
    orderStatusName: string = '';

    constructor(init?: Partial<AddOrderStatusCommand>) {
        Object.assign(this, init);
    }
}
