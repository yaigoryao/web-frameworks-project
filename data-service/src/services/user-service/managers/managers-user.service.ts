import { Injectable, InternalServerErrorException, ForbiddenException, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { MapperService } from "../../mapper-service/mapper.service";
import { UserRepository, UserAddStatus, UserUpdateStatus } from "../../../repositoires/user-repository/user.repository";
import { RoleRepository } from "../../../repositoires/role-repository/role.repository";
import { User, UserDto, Role } from "@monorepo/shared";
import { GetUserQuery } from "../../../repositoires/user-repository/queries/get-user.query";
import { AddUserCommand } from "../../../repositoires/user-repository/commands/add-user.command";
import { UpdateUserCommand } from "../../../repositoires/user-repository/commands/update-user.command";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

@Injectable()
export class ManagersUserService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(Role) private readonly roleModel: typeof Role,
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository,
        private readonly mapper: MapperService
    ) { }

    public async getUsers(query: GetUserQuery, managerLogin: string | null): Promise<UserDto | null> {
        try {
            if (!managerLogin) {
                throw new NotFoundException("Менеджер не найден");
            }

            const manager = await this.userModel.findOne({ where: { login: managerLogin }, include: [Role] });
            if (!manager) {
                throw new NotFoundException("Менеджер не найден");
            }

            // Если указан конкретный пользователь
            if (query.login || query.id) {
                const user = await this.userRepository.getUser(query);
                if (!user) {
                    throw new NotFoundException("Пользователь не найден");
                }

                // Менеджер может читать самого себя
                if (user.login === managerLogin) {
                    return this.mapper.toDto<User, UserDto>(user);
                }

                // Менеджер может читать только обычных пользователей
                if (user.role?.roleName?.toLowerCase() !== 'user') {
                    throw new ForbiddenException("Недостаточно прав для чтения информации об этом пользователе");
                }

                return this.mapper.toDto<User, UserDto>(user);
            }

            // Если пользователь не указан, вернуть самого себя
            const selfUser = await this.userModel.findOne({ where: { login: managerLogin }, include: [Role] });
            return this.mapper.toDto<User, UserDto>(selfUser!);
        }
        catch (error) {
            if (error instanceof ForbiddenException || error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException("Ошибка при получении информации о пользователе");
        }
    }

    public async addUser(command: AddUserCommand): Promise<UserAddStatus> {
        try {
            // Проверить, что roleId указывает на обычного пользователя
            const role = await this.roleModel.findOne({ where: { id: command.roleId } });
            if (!role || role.roleName.toLowerCase() !== 'user') {
                throw new BadRequestException("Менеджер может создавать только обычных пользователей");
            }

            // Добавить salt и refreshToken
            const salt = crypto.randomUUID();
            const hashedPassword = await bcrypt.hash(`${command.password}${salt}`, 10);

            const addCommand = new AddUserCommand({
                ...command,
                password: hashedPassword,
                salt: salt,
                refreshToken: crypto.randomUUID(),
                isActive: true,
                roleId: role.id
            });

            return await this.userRepository.addUser(addCommand);
        }
        catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException("Ошибка при добавлении пользователя");
        }
    }

    public async updateUser(command: UpdateUserCommand, managerLogin: string | null): Promise<UserUpdateStatus> {
        try {
            const userToUpdate = await this.userModel.findOne({ where: { login: command.login }, include: [Role] });
            if (!userToUpdate) {
                throw new NotFoundException("Пользователь не найден");
            }

            // Менеджер может обновлять только себя или обычных пользователей
            if (command.login !== managerLogin && userToUpdate.role?.roleName?.toLowerCase() !== 'user') {
                throw new ForbiddenException("Недостаточно прав для обновления информации об этом пользователе");
            }

            // Если при обновлении указана новая роль, проверить что это обычный пользователь
            if (command.roleId !== null) {
                const newRole = await this.roleModel.findOne({ where: { id: command.roleId } });
                if (!newRole || newRole.roleName.toLowerCase() !== 'user') {
                    throw new BadRequestException("Менеджер может назначать только роль обычного пользователя");
                }
            }

            return await this.userRepository.updateUser(command);
        }
        catch (error) {
            if (error instanceof ForbiddenException || error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException("Ошибка при обновлении информации о пользователе");
        }
    }
}
