import { Controller, Get, Post, Put, Delete, Query, Body, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { RolesGuard } from "../../../guards/role-guard/role.guard";
import { ManagersOrderService } from "../../../services/order-service/managers/managers-order.service";
import { ApiEnumResponse, OrderDto, ManagersDeleteOrderRequest } from "@monorepo/shared";
import { OrderAddStatus, OrderUpdateStatus } from "../../../repositoires/order-repository/order.repository";
import { GetOrderQuery } from "../../../repositoires/order-repository/queries/get-order.query";
import { AddOrderCommand } from "../../../repositoires/order-repository/commands/add-order.command";
import { UpdateOrderCommand } from "../../../repositoires/order-repository/commands/update-order.command";
import '../../../common/extensions/request.extension';
import { Routes } from "../../../common/routes/routes";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from "@nestjs/swagger";

@ApiTags(Routes.Manager.Order)
@Controller(Routes.Manager.Order)
export class ManagersOrderController {
    constructor(private readonly managersOrderService: ManagersOrderService) { }

    @ApiOperation({ summary: 'Get all orders' })
    @ApiResponse({ status: 200, description: 'List of orders', type: OrderDto, isArray: true })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Manager role required' })
    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    async getOrders(@Query() query: GetOrderQuery): Promise<(OrderDto | null)[]> {
        return await this.managersOrderService.getOrders(query);
    }

    @ApiOperation({ summary: 'Add new order' })
    @ApiBody({ type: AddOrderCommand, description: 'Order data to add' })
    @ApiEnumResponse(OrderAddStatus, 'Order insertion status', { status: 201 })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Manager role required' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    async addOrder(@Body() request: AddOrderCommand): Promise<OrderAddStatus> {
        return await this.managersOrderService.addOrder(request);
    }

    @ApiOperation({ summary: 'Update order information' })
    @ApiBody({ type: UpdateOrderCommand, description: 'Updated order data' })
    @ApiEnumResponse(OrderUpdateStatus, 'Order insertion status', { status: 202 })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Manager role required' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiBearerAuth()
    @Put()
    @UseGuards(AuthGuard, RolesGuard)
    async updateOrder(@Body() request: UpdateOrderCommand): Promise<OrderUpdateStatus> {
        return await this.managersOrderService.updateOrder(request);
    }

    @ApiOperation({ summary: 'Delete order' })
    @ApiResponse({ status: 200, description: 'Order deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Manager role required' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    @ApiBearerAuth()
    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    async deleteOrder(@Param('id') id: number): Promise<number> {
        const req = new ManagersDeleteOrderRequest({ id });
        return await this.managersOrderService.deleteOrder(req);
    }
}
