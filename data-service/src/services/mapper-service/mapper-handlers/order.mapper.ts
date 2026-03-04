import { Car, CarDto, OrderDto, RoleDto, IUser, UserDto, Role, User, Order, OrderStatus, OrderStatusDto } from "@monorepo/shared";
import { IDataMapper } from "./base.mapper";
import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { MapperService } from "../mapper.service";

@Injectable()
export class OrderMapper extends IDataMapper<Order, OrderDto> {
    readonly entityConstructor = Order;

    private mappingService: MapperService = null!;

    constructor(private moduleRef: ModuleRef) {
        super();
    }

    onModuleInit() {
        this.mappingService = this.moduleRef.get(MapperService, { strict: false });
    }

    toDto(entity: Order): OrderDto {
        const dto = {
            id: entity.id,
            totalPrice: entity.totalPrice,
            description: entity.description,
            startDate: entity.startDate,
            endDate: entity.endDate,
            plannedEndDate: entity.plannedEndDate,
            orderStatusId: entity.orderStatusId,
            orderStatus: this.mappingService.toDto<OrderStatus, OrderStatusDto>(entity.orderStatus),
            carId: entity.carId,
            car: this.mappingService.toDto<Car, CarDto>(entity.car),
            userId: entity.userId,
        } as OrderDto;
        return dto;
    }
}

