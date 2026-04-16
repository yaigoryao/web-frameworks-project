import { RefreshResponse, Role, User } from '@monorepo/shared';
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { LoginResponse } from '@monorepo/shared';
import { LoginRequest } from '@monorepo/shared';
import { RefreshRequest } from '@monorepo/shared';
import { UserJwtData } from '@monorepo/shared';
import { RegisterResponse } from '@monorepo/shared';
import { RegisterRequest } from '@monorepo/shared';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class AuthService {
    static readonly jwtOptions = { expiresIn: '60m', algorithm: 'RS256' } satisfies jwt.SignOptions;

    constructor(@InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(Role) private readonly roleModel: typeof Role,
        private configService: ConfigService) {

    }

    public async login(loginRequest: LoginRequest): Promise<LoginResponse> {
        //const errBuilder = new ErrorBuilder();

        const { login, password } = loginRequest;
        const user: User | null = (await this.userModel.findOne({
            where: {
                login: login
            }, include: [Role]
        })) ?? null;

        if (user === null) throw new NotFoundException("Пользователь не найден");//errBuilder.addErrorMessage('Пользователь не найден');

        let passwordMatch = await bcrypt.compare(`${password}${user!.salt}`, user!.password);

        if (!passwordMatch) throw new UnauthorizedException("Неверный пароль и/или логин!");//errBuilder.addErrorMessage('Неверный пароль');

        if (!user!.isActive) {
            throw new UnauthorizedException('Ваш аккаунт неактивен, обратитесь к нашему администратору');
        }

        //if (errBuilder.hasErrors()) throw errBuilder.build();

        const tokens = await this.refreshUserTokens(user!);
        return tokens as LoginResponse;
    }

    public async refresh(refreshRequest: RefreshRequest): Promise<RefreshResponse> {
        //const errBuilder = new ErrorBuilder();

        const { accessToken, refreshToken } = refreshRequest;

        const { login } = jwt.decode(accessToken) as UserJwtData;

        let user: User | null = (await this.userModel.findOne({
            where: {
                login: login
            }, include: [Role]
        })) ?? null;

        if (user === null) throw new NotFoundException("Пользователь не найден!");//errBuilder.addErrorMessage('Пользователь не найден');

        if (user!.refreshToken !== refreshToken) throw new UnauthorizedException("Неверный refresh token");
        //")// errBuilder.addErrorMessage('Неверный refresh token');

        if (!user!.isActive) {
            throw new UnauthorizedException('Ваш аккаунт неактивен, обратитесь к нашему администратору');
        }

        const tokens = await this.refreshUserTokens(user!);

        //if (errBuilder.hasErrors()) throw errBuilder.build();
        return tokens as RefreshResponse;

    }

    public async register(registerRequest: RegisterRequest): Promise<RegisterResponse> {

        //const errBuilder = new ErrorBuilder();

        let users = await this.userModel.findAll({
            where: {
                login: registerRequest.login
            }
        });

        if (users.length > 0) throw new ConflictException("Данный логин уже занят!");//errBuilder.addErrorMessage('Пользователь с таким логином уже существует');

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
                password: await bcrypt.hash(`${registerRequest.password.trim()}${salt}`, 10),
                salt: salt,
                refreshToken: crypto.randomUUID(),
                roleId: userRole!.id
            } as User);
        }
        catch (error: unknown) {
            throw new InternalServerErrorException("Ошибка при регистрации пользователя");
            // if (error instanceof Error) {
            //     errBuilder.addErrorMessage(error.message);
            // }
        }

        //if (user === null) errBuilder.addErrorMessage('Ошибка создания пользователя');

        //if (errBuilder.hasErrors()) throw errBuilder.build();

        // После успешной регистрации возвращаем токены, чтобы пользователь автоматически вошел в систему
        const tokens = await this.refreshUserTokens(user!);
        return tokens as RegisterResponse;
    }

    private async refreshUserTokens(user: User): Promise<RefreshResponse> {
        try {
            user.refreshToken = crypto.randomUUID();
            await user.save();

            let private_key = this.configService.get<string>('JWT_SECRET')!;
            //private_key = private_key.replace(/\\n/g, '\n');

            return {
                accessToken: jwt.sign({ login: user!.login, role: user!.role?.roleName } as UserJwtData, private_key, AuthService.jwtOptions),
                refreshToken: user.refreshToken
            };
        }
        catch (error: unknown) {
            throw new InternalServerErrorException("Ошибка генерации токенов");
        }
    }
}

