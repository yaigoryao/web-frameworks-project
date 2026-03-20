import { ApiProperty } from '@nestjs/swagger';
import { CarDto } from "./car.dto";
import { OrderDto } from "./order.dto";
import { RoleDto } from "./role.dto";

export class UserDto {
    @ApiProperty({ description: 'User ID', example: 1 })
    declare id: number;

    @ApiProperty({ description: 'User login', example: 'user123' })
    declare login: string;

    @ApiProperty({ description: 'User name', example: 'John' })
    declare name: string;

    @ApiProperty({ description: 'User surname', example: 'Doe' })
    declare surname: string;

    @ApiProperty({ description: 'User patronymic', example: 'Michael' })
    declare patronymic: string;

    @ApiProperty({ description: 'Indicates if the user is active', example: true })
    declare isActive: boolean;

    @ApiProperty({ description: 'User phone number', example: '+1234567890' })
    declare phoneNumber: string;

    @ApiProperty({ description: 'ID of the user role', example: 1 })
    declare roleId: number;

    @ApiProperty({ description: 'User role details', example: { id: 1, roleName: 'Admin', description: 'Administrator role with full access' } })
    declare role: RoleDto;

    // declare cars: CarDto[];
    // declare orders: OrderDto[];
}
