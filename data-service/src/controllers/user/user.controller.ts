import { IError, splitErrorMessage } from "@monorepo/shared";
import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../guards/auth-guard/auth.guard";
import { IGetUserInfoRequest } from "../../services/user-service/models/get-user-info.request";
import { UserService } from "../../services/user-service/user.service";
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get()
    @UseGuards(AuthGuard)
    async getUserInfo(@Req() getUserInfoRequest: Request) {
        try {
            return await this.userService.getUserInfo(getUserInfoRequest.body);
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                return { error: splitErrorMessage(error) } satisfies IError;
            }
            return { error: ['Ошибка регистрации'] } satisfies IError;
        }
    }
}
