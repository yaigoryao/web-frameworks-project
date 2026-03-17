import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from '../../services/auth-service/auth.service';
import { Request } from 'express';
import { ILoginRequest } from '@monorepo/shared';
import { IError } from '@monorepo/shared';

@Controller('login')
export class LoginController {
    constructor(private readonly authService: AuthService) { }

    @Get()
    async login(@Req() request: Request) {
        return await this.authService.login(request.body as ILoginRequest);
        // try {
        // } catch (error: unknown) {
        //     if (error instanceof Error) {
        //         return { error: [error.message] } satisfies IError;
        //     }
        //     return { error: ['Ошибка входа в аккаунт'] } satisfies IError;
        // }
    }
}
