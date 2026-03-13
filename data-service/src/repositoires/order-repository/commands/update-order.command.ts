class UpdateOrderCommand {
    declare id: number;
    declare startDate: Date | null;
    declare endDate: Date | null;
    declare plannedEndDate: Date | null;
    declare orderStatusId: number | null;
    declare totalPrice: number | null;
    declare description: string | null;
}