import { Controller, Get, Post, Put, Query, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { RolesGuard } from "../../../guards/role-guard/role.guard";
import { ManagersOrderService } from "../../../services/order-service/managers/managers-order.service";
import { OrderDto } from "@monorepo/shared";
import { OrderAddStatus, OrderUpdateStatus } from "../../../repositoires/order-repository/order.repository";
import { GetOrderQuery } from "../../../repositoires/order-repository/queries/get-order.query";
import { AddOrderCommand } from "../../../repositoires/order-repository/commands/add-order.command";
import { UpdateOrderCommand } from "../../../repositoires/order-repository/commands/update-order.command";
import '../../../common/extensions/request.extension';

@Controller('manager/order')
export class ManagersOrderController {
    constructor(private readonly managersOrderService: ManagersOrderService) { }

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    async getOrders(@Query() query: GetOrderQuery): Promise<(OrderDto | null)[]> {
        return await this.managersOrderService.getOrders(query);
    }

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    async addOrder(@Body() request: AddOrderCommand): Promise<OrderAddStatus> {
        return await this.managersOrderService.addOrder(request);
    }

    @Put()
    @UseGuards(AuthGuard, RolesGuard)
    async updateOrder(@Body() request: UpdateOrderCommand): Promise<OrderUpdateStatus> {
        return await this.managersOrderService.updateOrder(request);
    }
}
