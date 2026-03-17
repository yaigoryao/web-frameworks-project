export class ManagersAddCarRequest {
    carNumber: string = '';
    modelName: string = '';
    vin: string = '';
    color: string = '';

    constructor(init?: Partial<ManagersAddCarRequest>) {
        Object.assign(this, init);
    }
}
