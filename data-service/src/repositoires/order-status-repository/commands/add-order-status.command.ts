import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class AddOrderStatusCommand {
    @IsString()
    @Type(() => String)
    orderStatusName: string = '';

    constructor(init?: Partial<AddOrderStatusCommand>) {
        Object.assign(this, init);
    }
}
