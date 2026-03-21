export class ManagersUpdateCarRequest {
    id: number = 0;
    carNumber: string | null = null;
    modelName: string | null = null;
    vin: string | null = null;
    color: string | null = null;

    constructor(init?: Partial<ManagersUpdateCarRequest>) {
        Object.assign(this, init);
    }
}
