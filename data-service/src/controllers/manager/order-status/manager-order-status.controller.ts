import { CustomerUpdateUserRequest, IError, OrderStatus, OrderStatusDto, splitErrorMessage } from "@monorepo/shared";
import { Body, Controller, Get, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { CustomerUserService } from "../../../services/user-service/customers/customers-user.service";
import { Request } from 'express';
import { Constants } from "../../../common/constants/constants";
import '../../../common/extensions/request.extension';
import { GetRoleQuery } from "../../../repositoires/role-repository/queries/get-role.query";
import { RoleRepository } from "../../../repositoires/role-repository/role.repository";
import { RolesGuard } from "../../../guards/role-guard/role.guard";
import { OrderStatusRepository } from "../../../repositoires/order-status-repository/order-status.repository";
import { GetOrderStatusQuery } from "../../../repositoires/order-status-repository/queries/get-order-status.query";
import { MapperService } from "../../../services/mapper-service/mapper.service";
import { Routes } from "../../../common/routes/routes";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from "@nestjs/swagger";

@ApiTags(Routes.Manager.OrderStatus)
@Controller(Routes.Manager.OrderStatus)
export class ManagersOrderStatusController {
    constructor(private readonly orderStatusRepository: OrderStatusRepository,
        private readonly mapper: MapperService
    ) {
    }

    @ApiOperation({ summary: 'Get all order statuses' })
    @ApiResponse({ status: 200, description: 'List of order statuses', type: OrderStatusDto, isArray: true })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Manager role required' })
    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    async getUserInfo(@Query() query: GetOrderStatusQuery) {
        return await this.mapper.toDtos<OrderStatus, OrderStatusDto>(await this.orderStatusRepository.getOrderStatus(query));//, getUserInfoRequest.user);
    }
}
