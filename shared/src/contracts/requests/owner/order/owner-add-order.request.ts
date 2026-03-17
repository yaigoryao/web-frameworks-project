export class OwnerAddOrderRequest {
    totalPrice: number = 0;
    description: string | null = null;
    startDate: Date = new Date();
    endDate: Date | null = null;
    plannedEndDate: Date = new Date();
    orderStatusId: number = 0;
    userId: number = 0;
    carId: number = 0;

    constructor(init?: Partial<OwnerAddOrderRequest>) {
        Object.assign(this, init);
    }
}
