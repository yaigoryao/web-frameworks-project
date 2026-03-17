export class AddCarCommand {
    carNumber: string = '';
    modelName: string = '';
    vin: string = '';
    color: string = '';

    constructor(init?: Partial<AddCarCommand>) {
        Object.assign(this, init);
    }
}
