import { CustomerUpdateUserRequest, IError, splitErrorMessage, UserDto } from "@monorepo/shared";
import { Body, Controller, Get, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
//import { IGetUserInfoRequest } from "../../services/user-service/models/get-user-info.request";
import { CustomerUserService } from "../../../services/user-service/customers/customers-user.service";
import { Request } from 'express';
import { Constants } from "../../../common/constants/constants";
import '../../../common/extensions/request.extension';
import { Routes } from "../../../common/routes/routes";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from "@nestjs/swagger";

@ApiTags(Routes.Customer.User)
@Controller(Routes.Customer.User)
export class CustomersUserController {
    constructor(private readonly customerUserService: CustomerUserService) {
    }

    @ApiOperation({ summary: 'Get current customer user information' })
    @ApiResponse({ status: 200, description: 'User information retrieved', type: UserDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
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

    @ApiOperation({ summary: 'Update current customer user information' })
    @ApiBody({ type: CustomerUpdateUserRequest, description: 'Updated user data' })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiBearerAuth()
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
