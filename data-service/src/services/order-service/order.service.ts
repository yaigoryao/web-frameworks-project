import { Car, ErrorBuilder, Order, OrderDto, OrderStatus, User, UserDto } from "@monorepo/shared";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
//import { IGetUserInfoRequest } from "./models/get-user-info.request";
import { MapperService } from "../mapper-service/mapper.service";
import { AuthorizationService } from "../authorization-service/authorization.service";
import { IGetOrdersRequest } from "./models/get-orders.request";
//import { IUpdateUserInfoRequest } from "./models/update-user-info.request";

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        private readonly mapper: MapperService,
        private readonly authorizationService: AuthorizationService,
        @InjectModel(Order) private readonly orderModel: typeof Order) { }

    public async getOrders(getOrderRequest: IGetOrdersRequest, user: User | null): Promise<OrderDto[]> {
        if (!user) {
            throw new NotFoundException("Пользователь не найден");
        }

        const orders = await this.orderModel.findAll({
            where: {
                userId: user.id
            },
            include: [
                { model: User },
                { model: OrderStatus },
                { model: Car },
            ],
            limit: getOrderRequest.count,
            offset: getOrderRequest.page * getOrderRequest.count
        });

        return orders.map(order => this.mapper.toDto<Order, OrderDto>(order));
    }
}
