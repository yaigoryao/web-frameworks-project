import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { CustomerOrderService } from "../../../services/order-service/customers/customers-order.service";
import { OrderDto } from "@monorepo/shared";
import { GetOrderQuery } from "../../../repositoires/order-repository/queries/get-order.query";
import { Request } from 'express';
import '../../../common/extensions/request.extension';

@Controller('order')
export class CustomerOrderController {
    constructor(private readonly customerOrderService: CustomerOrderService) { }

    @Get()
    @UseGuards(AuthGuard)
    async getOrders(@Query() query: GetOrderQuery, @Req() req: Request): Promise<(OrderDto | null)[]> {
        query.userLogin = req.login;
        return await this.customerOrderService.getOrders(query);
    }
}
