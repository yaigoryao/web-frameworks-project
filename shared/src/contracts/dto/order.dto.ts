import { ICarDto } from "./car.dto";
import { IOrderStatusDto } from "./order-status.dto";

export interface IOrderDto {
    id: number;
    totalPrice: number;
    description: string;
    startDate: Date;
    endDate: Date;
    plannedEndDate: Date;
    orderStatusId: number;
    orderStatus: IOrderStatusDto;
    carId: number;
    car: ICarDto;
    userId: number;
}