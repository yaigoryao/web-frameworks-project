import { Type } from 'class-transformer';

export class UpdateCarCommand {
    @Type(() => Number)
    id: number = 0;

    @Type(() => String)
    carNumber: string | null = null;

    @Type(() => String)
    modelName: string | null = null;

    @Type(() => String)
    vin: string | null = null;

    @Type(() => String)
    color: string | null = null;

    constructor(init?: Partial<UpdateCarCommand>) {
        Object.assign(this, init);
    }
}