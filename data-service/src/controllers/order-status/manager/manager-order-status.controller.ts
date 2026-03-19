import { CustomerUpdateUserRequest, IError, OrderStatus, OrderStatusDto, splitErrorMessage } from "@monorepo/shared";
import { Body, Controller, Get, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { CustomerUserService } from "../../../services/user-service/customers/customers-user.service";
import { Request } from 'express';
import { Constants } from "../../../common/constants/constants";
import '../../../common/extensions/request.extension';
import { GetRoleQuery } from "data-service/src/repositoires/role-repository/queries/get-role.query";
import { RoleRepository } from "data-service/src/repositoires/role-repository/role.repository";
import { RolesGuard } from "data-service/src/guards/role-guard/role.guard";
import { OrderStatusRepository } from "data-service/src/repositoires/order-status-repository/order-status.repository";
import { GetOrderStatusQuery } from "data-service/src/repositoires/order-status-repository/queries/get-order-status.query";
import { MapperService } from "data-service/src/services/mapper-service/mapper.service";

@Controller('manager/orderstatus')
export class ManagersOrderStatusController {
    constructor(private readonly orderStatusRepository: OrderStatusRepository,
        private readonly mapper: MapperService
    ) {
    }

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    async getUserInfo(@Query() query: GetOrderStatusQuery) {
        return await this.mapper.toDtos<OrderStatus, OrderStatusDto>(await this.orderStatusRepository.getOrderStatus(query));//, getUserInfoRequest.user);
    }
}
