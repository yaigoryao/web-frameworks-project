export class OwnerGetCarsRequest {
    id: number | null = null;
    carNumber: string | null = null;
    vin: string | null = null;
    limit: number = 0;
    offset: number = 0;

    constructor(init?: Partial<OwnerGetCarsRequest>) {
        Object.assign(this, init);
    }
}
