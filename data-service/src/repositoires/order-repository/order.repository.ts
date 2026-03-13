import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Car, Order, User } from '@monorepo/shared';
import { WhereOptions } from 'sequelize';
import { Op } from 'sequelize';

enum OrderUpdateStatus {
    Success,
    NotFound,
    Error
}

@Injectable()
export class OrderRepository {
    constructor(
        @InjectModel(Order) private readonly orderRepository: typeof Order) { }

    async getOrders(query: GetOrderQuery): Promise<Order[] | null> {
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
        return this.orderRepository.findAll({ where: whereOptions, limit: query.limit, offset: query.offset });
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
}