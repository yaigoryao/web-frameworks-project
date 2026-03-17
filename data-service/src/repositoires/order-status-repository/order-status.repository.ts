import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Car, OrderStatus, Role, User } from '@monorepo/shared';
import { WhereOptions } from 'sequelize';
import { GetOrderStatusQuery } from './queries/get-order-status.query';
import { UpdateOrderStatusCommand } from './command/update-order-status.command';
import { AddOrderStatusCommand } from './commands/add-order-status.command';

export enum OrderStatusAddStatus {
    Success,
    Error
}

export enum OrderStatusUpdateStatus {
    Success,
    NotFound,
    Error
}

@Injectable()
export class OrderStatusRepository {
    constructor(
        @InjectModel(OrderStatus) private readonly orderStatusRepository: typeof OrderStatus) { }

    async getOrderStatus(query: GetOrderStatusQuery): Promise<OrderStatus | null> {
        const whereOptions: WhereOptions = {};
        if (query.id) {
            whereOptions.id = query.id;
        }
        return this.orderStatusRepository.findOne({ where: whereOptions });
    }

    async updateOrderStatus(command: UpdateOrderStatusCommand): Promise<OrderStatusUpdateStatus> {
        try {
            const orderStatus = await this.orderStatusRepository.findOne({ where: { id: command.id } });
            if (!orderStatus) {
                return OrderStatusUpdateStatus.NotFound;
            }
            if (command.orderStatusName !== null) {
                orderStatus.orderStatusName = command.orderStatusName;
            }

            await orderStatus.save();
            return OrderStatusUpdateStatus.Success;
        }
        catch (error) {
            return OrderStatusUpdateStatus.Error;
        }
    }

    async addOrderStatus(command: AddOrderStatusCommand): Promise<OrderStatusAddStatus> {
        try {
            const orderStatus = this.orderStatusRepository.build({
                orderStatusName: command.orderStatusName
            } as any);
            await orderStatus.save();
            return OrderStatusAddStatus.Success;
        }
        catch (error) {
            return OrderStatusAddStatus.Error;
        }
    }
}