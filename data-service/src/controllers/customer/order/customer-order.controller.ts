import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { CustomerOrderService } from "../../../services/order-service/customers/customers-order.service";
import { OrderDto } from "@monorepo/shared";
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
}
