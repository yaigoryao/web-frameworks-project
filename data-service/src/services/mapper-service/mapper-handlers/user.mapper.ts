import { Car, CarDto, OrderDto, RoleDto, IUser, UserDto, Role, User, Order } from "@monorepo/shared";
import { IDataMapper } from "./base.mapper";
import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { MapperService } from "../mapper.service";

@Injectable()
export class UserMapper extends IDataMapper<User, UserDto> {
    readonly entityConstructor = User;

    private mappingService: MapperService = null!;

    constructor(private moduleRef: ModuleRef) {
        super();
    }

    onModuleInit() {
        this.mappingService = this.moduleRef.get(MapperService, { strict: false });
    }

    toDto(entity: User): UserDto {
        const dto = {
            id: entity.id,
            name: entity.name,
            surname: entity.surname,
            patronymic: entity.patronymic,
            isActive: entity.isActive,
            phoneNumber: entity.phoneNumber,
            roleId: entity.roleId,
            role: this.mappingService.toDto<Role, RoleDto>(entity.role),
            login: entity.login,
            // cars: entity.cars.map(car => this.mappingService.toDto<Car, CarDto>(car)),
            // orders: entity.orders.map(order => this.mappingService.toDto<Order, OrderDto>(order)),
        } as UserDto;
        return dto;
    }
}

