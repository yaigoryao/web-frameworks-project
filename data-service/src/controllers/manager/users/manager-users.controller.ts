import { Controller, Get, Post, Query, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { RolesGuard } from "../../../guards/role-guard/role.guard";
import { UserRepository, UserAddStatus } from "../../../repositoires/user-repository/user.repository";
import { RoleRepository } from "../../../repositoires/role-repository/role.repository";
import { User, UserDto, Role } from "@monorepo/shared";
import { MapperService } from "../../../services/mapper-service/mapper.service";
import { AddUserCommand } from "../../../repositoires/user-repository/commands/add-user.command";
import { GetUserQuery } from "../../../repositoires/user-repository/queries/get-user.query";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import '../../../common/extensions/request.extension';
import { Routes } from "../../../common/routes/routes";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from "@nestjs/swagger";

@ApiTags(Routes.Manager.Users)
@Controller(Routes.Manager.Users)
export class ManagerUsersController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository,
        private readonly mapper: MapperService
    ) { }

    @ApiOperation({ summary: 'Get all users with pagination and filtering' })
    @ApiResponse({ status: 200, description: 'List of users', type: UserDto, isArray: true })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Manager role required' })
    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    async getUsers(@Query() query: {
        role?: string;
        search?: string;
        limit?: number;
        offset?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{ users: UserDto[]; total: number }> {
        const { users, total } = await this.userRepository.getUsers(query);
        return {
            users: this.mapper.toDtos<User, UserDto>(users).filter((user): user is UserDto => user !== null),
            total
        };
    }

    @ApiOperation({ summary: 'Add new user (user role only)' })
    @ApiBody({ type: AddUserCommand, description: 'User data to add' })
    @ApiResponse({ status: 201, description: 'User added successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Manager role required' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    async addUser(@Body() body: {
        name: string;
        surname: string;
        patronymic?: string;
        login: string;
        password: string;
        phoneNumber?: string;
    }): Promise<{ id: number }> {
        // Manager can only create 'user' role users
        const role = await this.roleRepository.findRoleByName('user');
        if (!role) {
            throw new Error("Роль 'user' не найдена");
        }

        const salt = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(`${body.password.trim()}${salt}`, 10);

        const command = new AddUserCommand({
            login: body.login,
            password: hashedPassword,
            salt: salt,
            refreshToken: crypto.randomUUID(),
            name: body.name,
            surname: body.surname,
            patronymic: body.patronymic || null,
            phoneNumber: body.phoneNumber || '',
            isActive: true,
            roleId: role.id
        });

        const result = await this.userRepository.addUser(command);
        if (result !== UserAddStatus.Success) {
            throw new Error("Ошибка при добавлении пользователя");
        }

        const user = await this.userRepository.getUser(new GetUserQuery({ login: body.login }));
        return { id: user!.id };
    }
}


