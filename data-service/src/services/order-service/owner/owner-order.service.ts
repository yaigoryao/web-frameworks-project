import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { MapperService } from "../../mapper-service/mapper.service";
import { OrderRepository } from "../../../repositoires/order-repository/order.repository";
import { Order, OrderDto } from "@monorepo/shared";
import { GetOrderQuery } from "../../../repositoires/order-repository/queries/get-order.query";

@Injectable()
export class OwnerOrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly mapper: MapperService
    ) { }

    public async getOrders(query: GetOrderQuery): Promise<(OrderDto | null)[]> {
        try {
            const orders = await this.orderRepository.getOrders(query);
            return this.mapper.toDtos<Order, OrderDto>(orders || []);
        }
        catch (error) {
            throw new InternalServerErrorException("Ошибка при получении информации о заказах");
        }
    }
}
