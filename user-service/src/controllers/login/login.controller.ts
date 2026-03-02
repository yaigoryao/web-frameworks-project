import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from 'user-service/src/services/auth-service/auth.service';
import { Request } from 'express';
import { ILoginRequest } from 'user-service/src/services/auth-service/models/login.request';
import { IError } from '@monorepo/shared/contracts/dto/error.dto';
import { error } from 'console';
import { splitErrorMessage } from '@monorepo/shared';
@Controller('login')
export class LoginController {
    constructor(private readonly authService: AuthService) { 

    }

    @Get()
    async login(@Req() request: Request) {
        try 
        {
            const tokens = await this.authService.login(request.body as ILoginRequest);
            return tokens;
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                return { error: splitErrorMessage(error) } satisfies IError;
            }
            return { error: ['Ошибка входа в аккаунт'] } satisfies IError;
        }
    }
}
