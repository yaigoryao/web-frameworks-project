import { Controller, Get, Post, Query, Body, Req } from '@nestjs/common';
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
    async login(@Body() body: LoginRequest) {
        return await this.authService.login(body);
    }

    // Keep GET for backwards compatibility, but with simplified validation
    @Get()
    async loginGet(@Query('login') login: string, @Query('password') password: string) {
        return await this.authService.login({ login, password });
    }
}
