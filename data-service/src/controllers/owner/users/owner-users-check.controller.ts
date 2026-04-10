import { Controller, Get, Post, Query, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { UserRepository } from "../../../repositoires/user-repository/user.repository";
import { GetUserQuery } from "../../../repositoires/user-repository/queries/get-user.query";
import { Routes } from "../../../common/routes/routes";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from "@nestjs/swagger";

@ApiTags(Routes.Owner.Users)
@Controller(Routes.Owner.Users)
export class OwnerUsersCheckController {
    constructor(private readonly userRepository: UserRepository) { }

    @ApiOperation({ summary: 'Check if login is available' })
    @ApiResponse({ status: 200, description: 'Login availability' })
    @ApiBearerAuth()
    @Get('check-login')
    @UseGuards(AuthGuard)
    async checkLogin(@Query('login') login: string): Promise<{ available: boolean }> {
        const user = await this.userRepository.getUser(new GetUserQuery({ login }));
        return { available: !user };
    }
}
