export class OwnerUpdateOrderRequest {
    id: number = 0;
    startDate: Date | null = null;
    endDate: Date | null = null;
    plannedEndDate: Date | null = null;
    orderStatusId: number | null = null;
    totalPrice: number | null = null;
    description: string | null = null;

    constructor(init?: Partial<OwnerUpdateOrderRequest>) {
        Object.assign(this, init);
    }
}
