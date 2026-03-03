import { CarDto } from "./car.dto";
import { OrderStatusDto } from "./order-status.dto";

export class OrderDto {
    declare id: number;
    declare totalPrice: number;
    declare description: string;
    declare startDate: Date;
    declare endDate: Date;
    declare plannedEndDate: Date;
    declare orderStatusId: number;
    declare orderStatus: OrderStatusDto;
    declare carId: number;
    declare car: CarDto;
    declare userId: number;
}
