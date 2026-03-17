import { User, UserJwtData } from '@monorepo/shared';
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Constants } from 'data-service/src/common/constants/constants';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,
        private configService: ConfigService,
        @InjectModel(User) private readonly userModel: typeof User) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException("Отсутствует токен доступа");
        }
        try {
            const decoded = jwt.verify(token, this.configService.get('JWT_PUBLIC')!, { algorithms: ['RS256'] }) as UserJwtData;
            request.login = decoded.login;
            // request.user = await this.userModel.findOne({
            //     where: {
            //         login: decoded.login
            //     }
            // });
        } catch {
            throw new UnauthorizedException("Ошибка авторизации");
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type?.toLowerCase() === 'bearer:' ? token : undefined;
    }
}
