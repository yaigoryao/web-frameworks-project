import { Type } from 'class-transformer';

export class UpdateUserCarCommand {
    @Type(() => Number)
    userId: number = 0;

    @Type(() => Number)
    carId: number = 0;

    @Type(() => Boolean)
    ownsNow: boolean = true;

    constructor(init?: Partial<UpdateUserCarCommand>) {
        Object.assign(this, init);
    }
}