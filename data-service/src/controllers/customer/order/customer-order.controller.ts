import { Controller, Get, Post, Put, Delete, Query, Body, Param, Req, UseGuards, HttpCode } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { CustomerOrderService } from "../../../services/order-service/customers/customers-order.service";
import { OrderDto, CustomersAddOrderRequest, CustomersUpdateOrderRequest, CustomersDeleteOrderRequest } from "@monorepo/shared";
import { GetOrderQuery } from "../../../repositoires/order-repository/queries/get-order.query";
import { Request } from 'express';
import '../../../common/extensions/request.extension';
import { Routes } from "../../../common/routes/routes";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from "@nestjs/swagger";

@ApiTags(Routes.Customer.Order)
@Controller(Routes.Customer.Order)
export class CustomerOrderController {
    constructor(private readonly customerOrderService: CustomerOrderService) { }

    @ApiOperation({ summary: 'Get all orders for current customer' })
    @ApiResponse({ status: 200, description: 'List of customer orders', type: OrderDto, isArray: true })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard)
    async getOrders(@Query() query: GetOrderQuery, @Req() req: Request): Promise<(OrderDto | null)[]> {
        query.userLogin = req.login;
        return await this.customerOrderService.getOrders(query);
    }

    @ApiOperation({ summary: 'Create a new order for current customer' })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard)
    @HttpCode(201)
    async createOrder(@Body() req: CustomersAddOrderRequest, @Req() request: Request): Promise<number> {
        return await this.customerOrderService.createOrder(req, request.login || '');
    }

    @ApiOperation({ summary: 'Update order details' })
    @ApiResponse({ status: 200, description: 'Order updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - not your order' })
    @ApiBearerAuth()
    @Put()
    @UseGuards(AuthGuard)
    async updateOrder(@Body() req: CustomersUpdateOrderRequest, @Req() request: Request): Promise<number> {
        return await this.customerOrderService.updateOrder(req, request.login || '');
    }

    @ApiOperation({ summary: 'Delete order' })
    @ApiResponse({ status: 200, description: 'Order deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - not your order' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    @ApiBearerAuth()
    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteOrder(@Param('id') id: number, @Req() request: Request): Promise<number> {
        return await this.customerOrderService.deleteOrder(id, request.login || '');
    }
}
