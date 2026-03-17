import { OrderStatus, OrderStatusDto, RoleDto } from "@monorepo/shared";
import { IDataMapper } from './base.mapper';
import { MapperService } from "../mapper.service";
import { ModuleRef } from "@nestjs/core";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OrderStatusMapper extends IDataMapper<OrderStatus, OrderStatusDto> {
    readonly entityConstructor = OrderStatus;

    toDto(entity: OrderStatus): OrderStatusDto {
        const dto = {
            id: entity.id,
            orderStatusName: entity.orderStatusName
        } as OrderStatusDto;
        return dto;
    }
}