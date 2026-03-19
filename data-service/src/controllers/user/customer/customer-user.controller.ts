import { CustomerUpdateUserRequest, IError, splitErrorMessage } from "@monorepo/shared";
import { Body, Controller, Get, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
//import { IGetUserInfoRequest } from "../../services/user-service/models/get-user-info.request";
import { CustomerUserService } from "../../../services/user-service/customers/customers-user.service";
import { Request } from 'express';
import { Constants } from "../../../common/constants/constants";
import '../../../common/extensions/request.extension';

@Controller('customer/user')
export class CustomersUserController {
    constructor(private readonly customerUserService: CustomerUserService) {
    }

    @Get()
    @UseGuards(AuthGuard)
    async getUserInfo(@Req() getUserInfoRequest: Request) {
        return await this.customerUserService.getUserInfo(getUserInfoRequest.login);//, getUserInfoRequest.user);
        // try {
        // }
        // catch (error: unknown) {
        //     if (error instanceof Error) {
        //         return { error: [error.message] } satisfies IError;
        //     }
        //     return { error: ['Ошибка регистрации'] } satisfies IError;
        // }
    }

    @Put()
    @UseGuards(AuthGuard)
    async updateUserInfo(@Body() query: CustomerUpdateUserRequest, @Req() updateUserRequest: Request) {
        return await this.customerUserService.updateUser(updateUserRequest.login, query);
        // try {
        //     return await this.customerUserService.();
        //     //return await this.userService.getUserInfo();//, getUserInfoRequest.user);
        // }
        // catch (error: unknown) {
        //     if (error instanceof Error) {
        //         return { error: [error.message] } satisfies IError;
        //     }
        //     return { error: ['Ошибка регистрации'] } satisfies IError;
        // }
    }
}
