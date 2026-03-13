export class UpdateCarCommand {
    id: number = 0;
    carNumber: string | null = null;
    modelName: string | null = null;
    vin: string | null = null;
    color: string | null = null;

    constructor(init?: Partial<UpdateCarCommand>) {
        Object.assign(this, init);
    }
}