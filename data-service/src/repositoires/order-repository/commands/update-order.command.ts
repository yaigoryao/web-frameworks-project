export class UpdateOrderCommand {
    id: number = 0;
    startDate: Date | null = null;
    endDate: Date | null = null;
    plannedEndDate: Date | null = null;
    orderStatusId: number | null = null;
    totalPrice: number | null = null;
    description: string | null = null;

    constructor(init?: Partial<UpdateOrderCommand>) {
        Object.assign(this, init);
    }
}