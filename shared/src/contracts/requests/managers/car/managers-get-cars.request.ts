export class ManagersGetCarsRequest {
    id: number | null = null;
    carNumber: string | null = null;
    vin: string | null = null;
    limit: number = 0;
    offset: number = 0;

    constructor(init?: Partial<ManagersGetCarsRequest>) {
        Object.assign(this, init);
    }
}
