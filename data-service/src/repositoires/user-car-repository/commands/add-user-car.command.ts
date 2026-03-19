import { Type } from 'class-transformer';

export class AddUserCarCommand {
    @Type(() => Number)
    userId: number = 0;

    @Type(() => Number)
    carId: number = 0;

    @Type(() => Boolean)
    ownsNow: boolean = true;

    constructor(init?: Partial<AddUserCarCommand>) {
        Object.assign(this, init);
    }
}
