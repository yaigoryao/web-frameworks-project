import { Role, User } from '@monorepo/shared';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IRefreshResponse } from './models/refresh.response';
import { ILoginResponse } from './models/login.response';
import { ILoginRequest } from './models/login.request';
import { IRefreshRequest } from './models/refresh.request';
import { IUserJwtData } from '@monorepo/shared/contracts/dto/user-jwt-data.dto';
import { IRegisterResponse } from './models/register.response';
import { IRegisterRequest } from './models/register.request';

@Injectable()
export class AuthService {
    static readonly jwtOptions = { expiresIn: '2m', algorithm: 'RS256' } satisfies jwt.SignOptions;

    constructor(@InjectModel(User) private readonly userModel: typeof User,
                @InjectModel(Role) private readonly roleModel: typeof Role) {

    }

    public async login(loginRequest: ILoginRequest): Promise<ILoginResponse> {
        const { login, password } = loginRequest;
        const user: User | null = (await this.userModel.findOne({
            where: {
                login: login
            }
        })) ?? null;
        if (user === null) throw new Error('Пользователь не найден');

        let passwordMatch = await bcrypt.compare(`${password}${user!.salt}`, user!.password);

        if (!passwordMatch) throw new Error('Неверный пароль');

        const tokens = await this.refreshUserTokens(user);
        return tokens satisfies ILoginResponse;
    }

    public async refresh(refreshRequest: IRefreshRequest): Promise<IRefreshResponse> {
        const { accessToken, refreshToken } = refreshRequest

        const { login } = jwt.decode(accessToken) as IUserJwtData;

        let user: User | null = (await User.findOne({
            where: {
                login: login
            }
        })) ?? null;

        if (user === null) throw Error('Пользователь не найден');

        if (user.refreshToken !== refreshToken) throw Error('Неверный refresh token');

        const tokens = await this.refreshUserTokens(user);

        return tokens satisfies IRefreshResponse;

    }

    public async register(registerRequest: IRegisterRequest): Promise<IRegisterResponse> {

        let users = await User.findAll({
            where: {
                login: registerRequest.login
            }
        });

        if (users.length > 0) throw Error('Пользователь с таким логином уже существует');
        

        const userRole = await this.roleModel.findOne({ where: {
            roleName: "user"
        } });

        const salt = crypto.randomUUID();
        const user = await this.userModel.create({
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

        return { login: user.login } satisfies IRegisterResponse;
    }

    private async refreshUserTokens(user: User): Promise<IRefreshResponse> {
        user.refreshToken = crypto.randomUUID();
        await user.save();

        return {
            accessToken: jwt.sign({ login: user!.login } satisfies IUserJwtData, process.env.PRIVATE_KEY! as string, AuthService.jwtOptions),
            refreshToken: user.refreshToken
        };
    }
}
