import { Controller, Get, Post, Put, Query, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { OwnerGuard } from "../../../guards/owner-guard/owner.guard";
import { OwnerOrderService } from "../../../services/order-service/owner/owner-order.service";
import { OrderDto } from "@monorepo/shared";
import { GetOrderQuery } from "../../../repositoires/order-repository/queries/get-order.query";
import '../../../common/extensions/request.extension';

@Controller('order')
export class OwnerOrderController {
    constructor(private readonly ownerOrderService: OwnerOrderService) { }

    @Get()
    @UseGuards(AuthGuard, OwnerGuard)
    async getOrders(@Query() query: GetOrderQuery): Promise<(OrderDto | null)[]> {
        return await this.ownerOrderService.getOrders(query);
    }
}
