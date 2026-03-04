import { UserJwtData } from '@monorepo/shared';
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,
        private configService: ConfigService) {

    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException("Отсутствует токен доступа");
        }
        try {
            const decoded = jwt.verify(token, this.configService.get('JWT_PUBLIC')!, { algorithms: ['RS256'] }) as UserJwtData;
            request[Constants.User] = decoded;
        } catch {
            throw new UnauthorizedException("Ошибка авторизации");
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
