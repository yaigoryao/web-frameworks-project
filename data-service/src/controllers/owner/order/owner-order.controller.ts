import { Controller, Get, Post, Put, Query, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { OwnerGuard } from "../../../guards/owner-guard/owner.guard";
import { OwnerOrderService } from "../../../services/order-service/owner/owner-order.service";
import { OrderDto } from "@monorepo/shared";
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
}
