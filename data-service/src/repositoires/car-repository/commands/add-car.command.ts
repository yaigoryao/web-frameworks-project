import { Type } from 'class-transformer';

export class AddCarCommand {
    @Type(() => String)
    carNumber: string = '';

    @Type(() => String)
    modelName: string = '';

    @Type(() => String)
    vin: string = '';

    @Type(() => String)
    color: string = '';

    constructor(init?: Partial<AddCarCommand>) {
        Object.assign(this, init);
    }
}
