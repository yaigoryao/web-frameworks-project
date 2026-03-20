import { CustomerUpdateUserRequest, IError, Role, RoleDto, splitErrorMessage, UserCar, UserCarDto } from "@monorepo/shared";
import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { CustomerUserService } from "../../../services/user-service/customers/customers-user.service";
import { Request } from 'express';
import { Constants } from "../../../common/constants/constants";
import '../../../common/extensions/request.extension';
import { Routes } from "../../../common/routes/routes";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from "@nestjs/swagger";
import { UserCarRepository } from "../../../repositoires/user-car-repository/user-car.repository";
import { MapperService } from "../../../services/mapper-service/mapper.service";
import { GetUserCarQuery } from "../../../repositoires/user-car-repository/queries/get-user-car.query";
import { RolesGuard } from "../../../guards/role-guard/role.guard";
import { AddUserCarCommand } from "../../../repositoires/user-car-repository/commands/add-user-car.command";
import { UpdateUserCarCommand } from "../../../repositoires/user-car-repository/commands/update-user-car.command";

@ApiTags(Routes.Manager.UserCar)
@Controller(Routes.Manager.UserCar)
export class ManagerUserCarController {
    constructor(private readonly userCarRepository: UserCarRepository,
        private readonly mapper: MapperService
    ) {
    }

    @ApiOperation({ summary: 'Get user cars associations' })
    @ApiResponse({ status: 200, description: 'List of user car associations', type: UserCarDto, isArray: true })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Manager role required' })
    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    async getUserInfo(@Query() query: GetUserCarQuery) {
        return await this.mapper.toDtos<UserCar, UserCarDto>(await this.userCarRepository.getUsersCars(query));//, getUserInfoRequest.user);
    }

    @ApiOperation({ summary: 'Add user-car association' })
    @ApiBody({ type: AddUserCarCommand, description: 'User car data to add' })
    @ApiResponse({ status: 201, description: 'User car association added successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Manager role required' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    async addUserCar(@Body() command: AddUserCarCommand) {
        return await this.userCarRepository.addUserCar(command);//, getUserInfoRequest.user);
    }

    @ApiOperation({ summary: 'Update user-car association' })
    @ApiBody({ type: UpdateUserCarCommand, description: 'Updated user car data' })
    @ApiResponse({ status: 200, description: 'User car association updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Manager role required' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiBearerAuth()
    @Put()
    @UseGuards(AuthGuard, RolesGuard)
    async updateUserCar(@Body() command: UpdateUserCarCommand) {
        return await this.userCarRepository.updateUserCar(command);//, getUserInfoRequest.user);
    }
}
