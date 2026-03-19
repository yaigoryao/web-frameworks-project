import { Type } from 'class-transformer';
import { IsNumber, IsBoolean } from 'class-validator';

export class AddUserCarCommand {
    @IsNumber()
    @Type(() => Number)
    userId: number = 0;

    @IsNumber()
    @Type(() => Number)
    carId: number = 0;

    @IsBoolean()
    @Type(() => Boolean)
    ownsNow: boolean = true;

    constructor(init?: Partial<AddUserCarCommand>) {
        Object.assign(this, init);
    }
}
