import { Type } from 'class-transformer';

export class UpdateOrderStatusCommand {
    @Type(() => Number)
    id: number = 0;

    @Type(() => String)
    orderStatusName: string | null = null;

    constructor(init?: Partial<UpdateOrderStatusCommand>) {
        Object.assign(this, init);
    }
}