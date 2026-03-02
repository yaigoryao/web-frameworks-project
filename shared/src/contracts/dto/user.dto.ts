import { ICarDto } from "./car.dto";
import { IOrderDto } from "./order.dto";
import { IRoleDto } from "./role.dto";

export interface IUserDto {
    id: number;
    name: string;
    surname: string;
    patronymic: string;
    isActive: boolean;
    phoneNumber: string;
    roleId: number;
    role: IRoleDto;
    cars: ICarDto[];
    orders: IOrderDto[];
}