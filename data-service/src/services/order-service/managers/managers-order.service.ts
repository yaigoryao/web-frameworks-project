import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { MapperService } from "../../mapper-service/mapper.service";
import { OrderRepository, OrderAddStatus, OrderUpdateStatus } from "../../../repositoires/order-repository/order.repository";
import { Order, OrderDto } from "@monorepo/shared";
import { GetOrderQuery } from "../../../repositoires/order-repository/queries/get-order.query";
import { AddOrderCommand } from "../../../repositoires/order-repository/commands/add-order.command";
import { UpdateOrderCommand } from "../../../repositoires/order-repository/commands/update-order.command";

@Injectable()
export class ManagersOrderService {
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

    public async addOrder(command: AddOrderCommand): Promise<OrderAddStatus> {
        try {
            return await this.orderRepository.addOrder(command);
        }
        catch (error) {
            throw new InternalServerErrorException("Ошибка при добавлении заказа");
        }
    }

    public async updateOrder(command: UpdateOrderCommand): Promise<OrderUpdateStatus> {
        try {
            return await this.orderRepository.updateOrder(command);
        }
        catch (error) {
            throw new InternalServerErrorException("Ошибка при обновлении информации о заказе");
        }
    }
}
