import { Controller, Get, Put, Query, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { OwnerGuard } from "../../../guards/owner-guard/owner.guard";
import { OwnerUserService } from "../../../services/user-service/owner/owner-user.service";
import { UserDto } from "@monorepo/shared";
import { UserUpdateStatus } from "../../../repositoires/user-repository/user.repository";
import { GetUserQuery } from "../../../repositoires/user-repository/queries/get-user.query";
import { UpdateUserCommand } from "../../../repositoires/user-repository/commands/update-user.command";
import '../../../common/extensions/request.extension';

@Controller('owner/user')
export class OwnerUserController {
    constructor(private readonly ownerUserService: OwnerUserService) { }

    @Get()
    @UseGuards(AuthGuard, OwnerGuard)
    async getUsers(@Query() query: GetUserQuery): Promise<UserDto | null> {
        return await this.ownerUserService.getUsers(query);
    }

    @Put()
    @UseGuards(AuthGuard, OwnerGuard)
    async updateUser(@Body() request: UpdateUserCommand): Promise<UserUpdateStatus> {
        return await this.ownerUserService.updateUser(request);
    }
}
