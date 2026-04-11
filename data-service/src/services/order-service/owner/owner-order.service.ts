import { Injectable, InternalServerErrorException, BadRequestException } from "@nestjs/common";
import { MapperService } from "../../mapper-service/mapper.service";
import { OrderRepository, OrderDeleteStatus } from "../../../repositoires/order-repository/order.repository";
import { Order, OrderDto, OwnerAddOrderRequest, OwnerUpdateOrderRequest, OwnerDeleteOrderRequest } from "@monorepo/shared";
import { GetOrderQuery } from "../../../repositoires/order-repository/queries/get-order.query";
import { GetUserQuery } from "../../../repositoires/user-repository/queries/get-user.query";
import { GetCarQuery } from "../../../repositoires/car-repository/queries/get-car.query";
import { UserRepository } from "../../../repositoires/user-repository/user.repository";
import { CarRepository } from "../../../repositoires/car-repository/car.repository";
import { AddOrderCommand } from "../../../repositoires/order-repository/commands/add-order.command";
import { UpdateOrderCommand } from "../../../repositoires/order-repository/commands/update-order.command";

@Injectable()
export class OwnerOrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly userRepository: UserRepository,
        private readonly carRepository: CarRepository,
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

    public async createOrder(req: OwnerAddOrderRequest): Promise<number> {
        try {
            const user = await this.userRepository.getUser(new GetUserQuery({ id: req.userId }));
            if (!user) {
                throw new BadRequestException("Пользователь не найден");
            }

            const cars = await this.carRepository.getCars(new GetCarQuery({ id: req.carId }));
            if (!cars || cars.length === 0) {
                throw new BadRequestException("Автомобиль не найден");
            }

            const command = new AddOrderCommand({
                userId: req.userId,
                carId: req.carId,
                totalPrice: req.totalPrice,
                description: req.description || null,
                startDate: new Date(),
                plannedEndDate: req.plannedEndDate,
                orderStatusId: req.orderStatusId
            });

            const result = await this.orderRepository.addOrder(command);
            return result === 0 ? 0 : 1; // success or error
        } catch (error) {
            console.error("Ошибка при создании заказа:", error);
            if (error instanceof BadRequestException) throw error;
            return 1; // error
        }
    }

    public async updateOrder(req: OwnerUpdateOrderRequest): Promise<number> {
        try {
            const orders = await this.orderRepository.getOrders(new GetOrderQuery({ id: req.id }));
            if (!orders || orders.length === 0) {
                return 1; // not found
            }

            const command = new UpdateOrderCommand({
                id: req.id,
                orderStatusId: req.orderStatusId ?? null,
                totalPrice: req.totalPrice ?? null,
                description: req.description ?? null,
                plannedEndDate: req.plannedEndDate ?? null,
                startDate: req.startDate ?? null,
                endDate: req.endDate ?? null,
            });

            const result = await this.orderRepository.updateOrder(command);
            return result === 0 ? 0 : 2; // success or error
        } catch (error) {
            console.error("Ошибка при обновлении заказа:", error);
            return 2; // error
        }
    }

    public async deleteOrder(req: OwnerDeleteOrderRequest): Promise<number> {
        try {
            const orders = await this.orderRepository.getOrders(new GetOrderQuery({ id: req.id }));
            if (!orders || orders.length === 0) {
                return 1; // not found
            }

            const result = await this.orderRepository.deleteOrder(req.id);
            return result === OrderDeleteStatus.Success ? 0 : 2;
        } catch (error) {
            console.error("Ошибка при удалении заказа:", error);
            return 2; // error
        }
    }
}
