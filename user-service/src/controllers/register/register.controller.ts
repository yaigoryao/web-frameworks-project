import { Body, ConflictException, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../services/auth-service/auth.service';
import { RegisterRequest, RegisterResponse } from '@monorepo/shared';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('register')
export class RegisterController {
    constructor(private readonly authService: AuthService) {

    }

    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({ status: 409, description: 'Conflict' })
    @ApiResponse({ status: 201, description: 'User created', type: RegisterResponse })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @Post()
    async register(@Body() body: RegisterRequest) {
        return await this.authService.register(body);
        // try {
        // }
        // catch (error: unknown) {
        //     if (error instanceof Error) {
        //         return { error: splitErrorMessage(error) } satisfies IError;
        //     }
        //     return { error: ['Ошибка регистрации'] } satisfies IError;
        // }
    }
}
