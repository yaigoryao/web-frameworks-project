import { IError } from '@monorepo/shared/contracts/dto/error.dto';
import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from 'user-service/src/services/auth-service/auth.service';
import { IRefreshRequest } from 'user-service/src/services/auth-service/models/refresh.request';
import { Request } from 'express';
import { splitErrorMessage } from '@monorepo/shared/common/utils/error.utils';

@Controller('refresh')
export class RefreshController {
    constructor(private readonly authService: AuthService) {
    
        }
    
        @Get()
        async register(@Req() refreshRequest: Request) {
            try {
                return await this.authService.refresh(refreshRequest.body);
            }
            catch(error: unknown) {
                if (error instanceof Error) {
                    return { error: splitErrorMessage(error) } satisfies IError;
                }
                return { error: ['Ошибка обновления токенов'] } satisfies IError;
            }
        }
}
