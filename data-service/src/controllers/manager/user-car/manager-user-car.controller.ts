import { CustomerUpdateUserRequest, IError, Role, RoleDto, splitErrorMessage, UserCar, UserCarDto } from "@monorepo/shared";
import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { CustomerUserService } from "../../../services/user-service/customers/customers-user.service";
import { Request } from 'express';
import { Constants } from "../../../common/constants/constants";
import '../../../common/extensions/request.extension';
import { GetRoleQuery } from "data-service/src/repositoires/role-repository/queries/get-role.query";
import { RoleRepository } from "data-service/src/repositoires/role-repository/role.repository";
import { RolesGuard } from "data-service/src/guards/role-guard/role.guard";
import { MapperService } from "data-service/src/services/mapper-service/mapper.service";
import { UserCarRepository } from "data-service/src/repositoires/user-car-repository/user-car.repository";
import { GetUserCarQuery } from "data-service/src/repositoires/user-car-repository/queries/get-user-car.query";
import { AddUserCarCommand } from "data-service/src/repositoires/user-car-repository/commands/add-user-car.command";
import { UpdateUserCarCommand } from "data-service/src/repositoires/user-car-repository/commands/update-user-car.command";
import { Routes } from "data-service/src/common/routes/routes";

@Controller(Routes.Manager.UserCar)
export class ManagerUserCarController {
    constructor(private readonly userCarRepository: UserCarRepository,
        private readonly mapper: MapperService
    ) {
    }

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    async getUserInfo(@Query() query: GetUserCarQuery) {
        return await this.mapper.toDtos<UserCar, UserCarDto>(await this.userCarRepository.getUsersCars(query));//, getUserInfoRequest.user);
    }

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    async addUserCar(@Body() command: AddUserCarCommand) {
        return await this.userCarRepository.addUserCar(command);//, getUserInfoRequest.user);
    }

    @Put()
    @UseGuards(AuthGuard, RolesGuard)
    async updateUserCar(@Body() command: UpdateUserCarCommand) {
        return await this.userCarRepository.updateUserCar(command);//, getUserInfoRequest.user);
    }
}
