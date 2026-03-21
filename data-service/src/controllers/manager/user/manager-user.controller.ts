import { Controller, Get, Post, Put, Query, Body, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { RolesGuard } from "../../../guards/role-guard/role.guard";
import { ManagersUserService } from "../../../services/user-service/managers/managers-user.service";
import { ApiEnumResponse, UserDto } from "@monorepo/shared";
import { UserAddStatus, UserUpdateStatus } from "../../../repositoires/user-repository/user.repository";
import { GetUserQuery } from "../../../repositoires/user-repository/queries/get-user.query";
import { AddUserCommand } from "../../../repositoires/user-repository/commands/add-user.command";
import { UpdateUserCommand } from "../../../repositoires/user-repository/commands/update-user.command";
import { Request } from 'express';
import '../../../common/extensions/request.extension';
import { Routes } from "../../../common/routes/routes";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from "@nestjs/swagger";

@ApiTags(Routes.Manager.User)
@Controller(Routes.Manager.User)
export class ManagersUserController {
    constructor(private readonly managersUserService: ManagersUserService) { }

    @ApiOperation({ summary: 'Get user information' })
    @ApiResponse({ status: 200, description: 'User information retrieved', type: UserDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Manager role required' })
    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    async getUsers(@Query() query: GetUserQuery, @Req() req: Request): Promise<UserDto | null> {
        return await this.managersUserService.getUsers(query, req.login);
    }

    // @Post()
    // @UseGuards(AuthGuard, RolesGuard)
    // async addUser(@Body() request: AddUserCommand): Promise<UserAddStatus> {
    //     return await this.managersUserService.addUser(request);
    // }

    @ApiOperation({ summary: 'Update user information' })
    @ApiBody({ type: UpdateUserCommand, description: 'Updated user data' })
    @ApiEnumResponse(UserUpdateStatus, 'User update status', { status: 200 })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Manager role required' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiBearerAuth()
    @Put()
    @UseGuards(AuthGuard, RolesGuard)
    async updateUser(@Body() request: UpdateUserCommand, @Req() req: Request): Promise<UserUpdateStatus> {
        return await this.managersUserService.updateUser(request, req.login);
    }
}
