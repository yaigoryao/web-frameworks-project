import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Car, Order, OrderStatus, User } from '@monorepo/shared';
import { WhereOptions } from 'sequelize';
import { Op } from 'sequelize';
import { UpdateOrderCommand } from './commands/update-order.command';
import { GetOrderQuery } from './queries/get-order.query';
import { AddOrderCommand } from './commands/add-order.command';

export enum OrderAddStatus {
    Success,
    Error
}

export enum OrderUpdateStatus {
    Success,
    NotFound,
    Error
}

export enum OrderDeleteStatus {
    Success,
    NotFound,
    Error
}

@Injectable()
export class OrderRepository {
    constructor(
        @InjectModel(Order) private readonly orderRepository: typeof Order) { }

    async getOrders(query: GetOrderQuery): Promise<Order[]> {
        const whereOptions: WhereOptions = {};
        if (query.id) {
            whereOptions.id = query.id;
        }
        if (query.startDate) {
            whereOptions.startDate = {
                [Op.gte]: query.startDate
            };
        }
        if (query.endDate) {
            whereOptions.endDate = {
                [Op.lte]: query.endDate
            };
        }
        if (query.orderStatusId) {
            whereOptions.orderStatusId = query.orderStatusId;
        }
        if (query.userId) {
            whereOptions.userId = query.userId;
        }
        if (query.userLogin) {
            const user = await User.findOne({ where: { login: query.userLogin } });
            if (user) {
                whereOptions.userId = user.id;
            }
            //whereOptions['$User.login$'] = query.userLogin;
        }
        return this.orderRepository.findAll({ where: whereOptions, limit: query.limit, offset: query.offset, include: [OrderStatus, Car] });
    }

    async updateOrder(command: UpdateOrderCommand): Promise<OrderUpdateStatus> {
        try {
            const order = await this.orderRepository.findOne({ where: { id: command.id } });
            if (!order) {
                return OrderUpdateStatus.NotFound;
            }
            if (command.startDate !== null) {
                order.startDate = command.startDate;
            }
            if (command.endDate !== null) {
                order.endDate = command.endDate;
            }
            if (command.plannedEndDate !== null) {
                order.plannedEndDate = command.plannedEndDate;
            }
            if (command.orderStatusId !== null) {
                order.orderStatusId = command.orderStatusId;
            }
            if (command.totalPrice !== null) {
                order.totalPrice = command.totalPrice;
            }
            if (command.description !== null) {
                order.description = command.description;
            }

            await order.save();
            return OrderUpdateStatus.Success;
        }
        catch (error) {
            return OrderUpdateStatus.Error;
        }
    }

    async addOrder(command: AddOrderCommand): Promise<OrderAddStatus> {
        try {
            const order = this.orderRepository.build({
                totalPrice: command.totalPrice,
                description: command.description,
                startDate: command.startDate,
                endDate: command.endDate,
                plannedEndDate: command.plannedEndDate,
                orderStatusId: command.orderStatusId,
                userId: command.userId,
                carId: command.carId
            } as any);
            await order.save();
            return OrderAddStatus.Success;
        }
        catch (error) {
            return OrderAddStatus.Error;
        }
    }

    async deleteOrder(id: number): Promise<OrderDeleteStatus> {
        try {
            const order = await this.orderRepository.findOne({ where: { id } });
            if (!order) {
                return OrderDeleteStatus.NotFound;
            }
            await order.destroy();
            return OrderDeleteStatus.Success;
        }
        catch (error) {
            return OrderDeleteStatus.Error;
        }
    }
}