import { splitErrorMessage } from '@monorepo/shared';
import { IError } from '@monorepo/shared';
import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../services/auth-service/auth.service';

@Controller('register')
export class RegisterController {
    constructor(private readonly authService: AuthService) {

    }

    @Post()
    async register(@Req() registerRequest: Request) {
        try {
            return await this.authService.register(registerRequest.body);
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                return { error: splitErrorMessage(error) } satisfies IError;
            }
            return { error: ['Ошибка регистрации'] } satisfies IError;
        }
    }
}
