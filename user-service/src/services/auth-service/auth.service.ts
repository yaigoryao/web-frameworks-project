import { ErrorBuilder, Role, User } from '@monorepo/shared';
import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IRefreshResponse } from './models/refresh.response';
import { ILoginResponse } from './models/login.response';
import { ILoginRequest } from './models/login.request';
import { IRefreshRequest } from './models/refresh.request';
import { UserJwtData } from '@monorepo/shared/contracts/dto/user-jwt-data.dto';
import { IRegisterResponse } from './models/register.response';
import { IRegisterRequest } from './models/register.request';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class AuthService {
    static readonly jwtOptions = { expiresIn: '2m', algorithm: 'RS256' } satisfies jwt.SignOptions;

    constructor(@InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(Role) private readonly roleModel: typeof Role,
        private configService: ConfigService) {

    }

    public async login(loginRequest: ILoginRequest): Promise<ILoginResponse> {
        //const errBuilder = new ErrorBuilder();

        const { login, password } = loginRequest;
        const user: User | null = (await this.userModel.findOne({
            where: {
                login: login
            }
        })) ?? null;

        if (user === null) throw new NotFoundException("Пользователь не найден");//errBuilder.addErrorMessage('Пользователь не найден');

        let passwordMatch = await bcrypt.compare(`${password}${user!.salt}`, user!.password);

        if (!passwordMatch) throw new UnauthorizedException("Неверный пароль и/или логин!");//errBuilder.addErrorMessage('Неверный пароль');

        //if (errBuilder.hasErrors()) throw errBuilder.build();

        const tokens = await this.refreshUserTokens(user!);
        return tokens satisfies ILoginResponse;
    }

    public async refresh(refreshRequest: IRefreshRequest): Promise<IRefreshResponse> {
        //const errBuilder = new ErrorBuilder();

        const { accessToken, refreshToken } = refreshRequest

        const { login } = jwt.decode(accessToken) as UserJwtData;

        let user: User | null = (await this.userModel.findOne({
            where: {
                login: login
            }
        })) ?? null;

        if (user === null) throw new NotFoundException("Пользователь не найден!");//errBuilder.addErrorMessage('Пользователь не найден');

        if (user!.refreshToken !== refreshToken) throw new UnauthorizedException("Неверный refresh token");
        //")// errBuilder.addErrorMessage('Неверный refresh token');

        const tokens = await this.refreshUserTokens(user!);

        //if (errBuilder.hasErrors()) throw errBuilder.build();
        return tokens satisfies IRefreshResponse;

    }

    public async register(registerRequest: IRegisterRequest): Promise<IRegisterResponse> {

        const errBuilder = new ErrorBuilder();

        let users = await this.userModel.findAll({
            where: {
                login: registerRequest.login
            }
        });

        if (users.length > 0) errBuilder.addErrorMessage('Пользователь с таким логином уже существует');


        let userRole = await this.roleModel.findOne({
            where: {
                roleName: "user"
            }
        });

        if (userRole === null) {
            userRole = await this.roleModel.create({ roleName: "user" } as Role);
            await userRole.save();
        }

        let salt: string = "";
        let user: User | null = null;

        try {
            salt = crypto.randomUUID();
            user = await this.userModel.create({
                login: registerRequest.login,
                name: registerRequest.name,
                surname: registerRequest.surname,
                patronymic: registerRequest.patronymic ?? null,
                phoneNumber: registerRequest.phoneNumber,
                password: await bcrypt.hash(`${registerRequest.password}${salt}`, 10),
                salt: salt,
                refreshToken: crypto.randomUUID(),
                roleId: userRole!.id
            } as User);
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                errBuilder.addErrorMessage(error.message);
            }
        }

        if (user === null) errBuilder.addErrorMessage('Ошибка создания пользователя');

        if (errBuilder.hasErrors()) throw errBuilder.build();
        return { login: user!.login } satisfies IRegisterResponse;
    }

    private async refreshUserTokens(user: User): Promise<IRefreshResponse> {
        try {
            user.refreshToken = crypto.randomUUID();
            await user.save();

            let private_key = this.configService.get<string>('JWT_SECRET')!;
            //private_key = private_key.replace(/\\n/g, '\n');

            return {
                accessToken: jwt.sign({ login: user!.login } as UserJwtData, private_key, AuthService.jwtOptions),
                refreshToken: user.refreshToken
            };
        }
        catch (error: unknown) {
            throw new InternalServerErrorException("Ошибка генерации токенов");
        }
    }
}
