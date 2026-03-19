import { Type } from 'class-transformer';
import { IsNumber, IsBoolean } from 'class-validator';

export class UpdateUserCarCommand {
    @IsNumber()
    @Type(() => Number)
    userId: number = 0;

    @IsNumber()
    @Type(() => Number)
    carId: number = 0;

    @IsBoolean()
    @Type(() => Boolean)
    ownsNow: boolean = true;

    constructor(init?: Partial<UpdateUserCarCommand>) {
        Object.assign(this, init);
    }
}