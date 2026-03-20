import { IError } from '@monorepo/shared/contracts/dto/error.dto';
import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from '../../services/auth-service/auth.service';
import { IRefreshRequest } from '@monorepo/shared';
import { Request } from 'express';
import { splitErrorMessage } from '@monorepo/shared';

@Controller('refresh')
export class RefreshController {
    constructor(private readonly authService: AuthService) {

    }

    @Get()
    async refersh(@Req() refreshRequest: Request) {
        return await this.authService.refresh(refreshRequest.body);
        // try {
        // }
        // catch (error: unknown) {
        //     if (error instanceof Error) {
        //         return { error: splitErrorMessage(error) } satisfies IError;
        //     }
        //     return { error: ['Ошибка обновления токенов'] } satisfies IError;
        // }
    }
}
