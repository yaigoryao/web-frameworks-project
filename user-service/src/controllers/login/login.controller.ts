import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from 'user-service/src/services/auth-service/auth.service';
import { Request } from 'express';
import { ILoginRequest } from 'user-service/src/services/auth-service/models/login.request';
@Controller('login')
export class LoginController {
    constructor(private readonly authService: AuthService) { 

    }

    @Get()
    async login(@Req() request: Request) {
        const tokens = await this.authService.login(request.body as ILoginRequest);
        return tokens;
    }
}
