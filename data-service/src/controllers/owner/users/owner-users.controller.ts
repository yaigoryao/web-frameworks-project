import { Controller, Get, Post, Put, Query, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../guards/auth-guard/auth.guard";
import { RolesGuard } from "../../../guards/role-guard/role.guard";
import { OwnerGuard } from "../../../guards/owner-guard/owner.guard";
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

@ApiTags(Routes.Owner.Users)
@Controller(Routes.Owner.Users)
export class OwnerUsersController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository,
        private readonly mapper: MapperService
    ) { }

    @ApiOperation({ summary: 'Get all users with pagination and filtering' })
    @ApiResponse({ status: 200, description: 'List of users', type: UserDto, isArray: true })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Owner only' })
    @ApiBearerAuth()
    @Get()
    @UseGuards(AuthGuard, OwnerGuard)
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

    @ApiOperation({ summary: 'Add new user' })
    @ApiBody({ type: AddUserCommand, description: 'User data to add' })
    @ApiResponse({ status: 201, description: 'User added successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Owner only' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard, OwnerGuard)
    async addUser(@Body() body: {
        name: string;
        surname: string;
        patronymic?: string;
        login: string;
        password: string;
        phoneNumber?: string;
        role: 'manager' | 'user';
    }): Promise<{ id: number }> {
        const role = await this.roleRepository.findRoleByName(body.role);
        if (!role) {
            throw new Error("Роль не найдена");
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

