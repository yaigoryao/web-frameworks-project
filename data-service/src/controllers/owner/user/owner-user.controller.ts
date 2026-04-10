import { Controller, Get, Put, Delete, Query, Body, Param, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { OwnerGuard } from "../../../guards/owner-guard/owner.guard";
import { OwnerUserService } from "../../../services/user-service/owner/owner-user.service";
import { ApiEnumResponse, UserDto, OwnerDeleteUserRequest } from "@monorepo/shared";
import { UserUpdateStatus } from "../../../repositoires/user-repository/user.repository";
import { GetUserQuery } from "../../../repositoires/user-repository/queries/get-user.query";
import { UpdateUserCommand } from "../../../repositoires/user-repository/commands/update-user.command";
import { Request } from 'express';
import '../../../common/extensions/request.extension';
import { Routes } from "../../../common/routes/routes";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from "@nestjs/swagger";

@ApiTags(Routes.Owner.User)
@Controller(Routes.Owner.User)
export class OwnerUserController {
    constructor(private readonly ownerUserService: OwnerUserService) { }

    @ApiOperation({ summary: 'Get owner user information' })
    @ApiResponse({ status: 200, description: 'Owner user information', type: UserDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Owner only' })
    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard, OwnerGuard)
    async getUsers(@Query() query: GetUserQuery): Promise<UserDto | null> {
        return await this.ownerUserService.getUsers(query);
    }

    @ApiOperation({ summary: 'Update owner user information' })
    @ApiBody({ type: UpdateUserCommand, description: 'Updated user data' })
    @ApiEnumResponse(UserUpdateStatus, 'Order update status', { status: 200 })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Owner only' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiBearerAuth()
    @Put()
    @UseGuards(AuthGuard, OwnerGuard)
    async updateUser(@Body() request: UpdateUserCommand): Promise<UserUpdateStatus> {
        return await this.ownerUserService.updateUser(request);
    }

    @ApiOperation({ summary: 'Delete user' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Owner only or cannot delete yourself' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiBearerAuth()
    @Delete(':login')
    @UseGuards(AuthGuard, OwnerGuard)
    async deleteUser(@Param('login') login: string, @Req() req: Request): Promise<number> {
        const deleteReq = new OwnerDeleteUserRequest({ login });
        return await this.ownerUserService.deleteUser(deleteReq, req.login);
    }
}
