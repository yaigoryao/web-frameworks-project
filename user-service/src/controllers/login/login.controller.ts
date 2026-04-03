import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AuthService } from '../../services/auth-service/auth.service';
import { Request } from 'express';
import { LoginRequest } from '@monorepo/shared';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginResponse } from '@monorepo/shared';

@Controller('login')
export class LoginController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'User logged in successfully', type: LoginResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Post()
    async login(@Body() query: LoginRequest) {
        return await this.authService.login(query);
        // try {
        // } catch (error: unknown) {
        //     if (error instanceof Error) {
        //         return { error: [error.message] } satisfies IError;
        //     }
        //     return { error: ['Ошибка входа в аккаунт'] } satisfies IError;
        // }
    }
}
