import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AuthService } from '../../services/auth-service/auth.service';
import { Request } from 'express';
import { RefreshRequest, RefreshResponse } from '@monorepo/shared';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('refresh')
export class RefreshController {
    constructor(private readonly authService: AuthService) {

    }

    @ApiOperation({ summary: 'Refresh tokens' })
    @ApiResponse({ status: 200, description: 'Tokens refreshed', type: RefreshResponse })
    @ApiResponse({ status: 404, description: 'Not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Post()
    async refersh(@Body() body: RefreshRequest) {
        return await this.authService.refresh(body);
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
