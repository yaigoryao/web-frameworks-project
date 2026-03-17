import { CarDto } from "./car.dto";
import { OrderDto } from "./order.dto";
import { RoleDto } from "./role.dto";

export class UserDto {
    declare id: number;
    declare name: string;
    declare surname: string;
    declare patronymic: string;
    declare isActive: boolean;
    declare phoneNumber: string;
    declare roleId: number;
    declare role: RoleDto;
    // declare cars: CarDto[];
    // declare orders: OrderDto[];
}