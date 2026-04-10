import { Controller, Get, Post, Put, Delete, Query, Body, Param, UseGuards, HttpCode } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { OwnerGuard } from "../../../guards/owner-guard/owner.guard";
import { OwnerOrderService } from "../../../services/order-service/owner/owner-order.service";
import { OrderDto, OwnerAddOrderRequest, OwnerUpdateOrderRequest, OwnerDeleteOrderRequest } from "@monorepo/shared";
import { GetOrderQuery } from "../../../repositoires/order-repository/queries/get-order.query";
import '../../../common/extensions/request.extension';
import { Routes } from "../../../common/routes/routes";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from "@nestjs/swagger";

@ApiTags(Routes.Owner.Order)
@Controller(Routes.Owner.Order)
export class OwnerOrderController {
    constructor(private readonly ownerOrderService: OwnerOrderService) { }

    @ApiOperation({ summary: 'Get owner orders' })
    @ApiResponse({ status: 200, description: 'List of owner orders', type: OrderDto, isArray: true })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Owner only' })
    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard, OwnerGuard)
    async getOrders(@Query() query: GetOrderQuery): Promise<(OrderDto | null)[]> {
        return await this.ownerOrderService.getOrders(query);
    }

    @ApiOperation({ summary: 'Create order' })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Owner only' })
    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard, OwnerGuard)
    @HttpCode(201)
    async createOrder(@Body() req: OwnerAddOrderRequest): Promise<number> {
        return await this.ownerOrderService.createOrder(req);
    }

    @ApiOperation({ summary: 'Update order' })
    @ApiResponse({ status: 200, description: 'Order updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Owner only' })
    @ApiBearerAuth()
    @Put()
    @UseGuards(AuthGuard, OwnerGuard)
    async updateOrder(@Body() req: OwnerUpdateOrderRequest): Promise<number> {
        return await this.ownerOrderService.updateOrder(req);
    }

    @ApiOperation({ summary: 'Delete order' })
    @ApiResponse({ status: 200, description: 'Order deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Owner only' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    @ApiBearerAuth()
    @Delete(':id')
    @UseGuards(AuthGuard, OwnerGuard)
    async deleteOrder(@Param('id') id: number): Promise<number> {
        const req = new OwnerDeleteOrderRequest({ id });
        return await this.ownerOrderService.deleteOrder(req);
    }
}
