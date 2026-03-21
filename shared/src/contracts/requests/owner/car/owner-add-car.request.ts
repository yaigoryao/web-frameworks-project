export class OwnerAddCarRequest {
    carNumber: string = '';
    modelName: string = '';
    vin: string = '';
    color: string = '';

    constructor(init?: Partial<OwnerAddCarRequest>) {
        Object.assign(this, init);
    }
}
