import { Injectable, InternalServerErrorException, ForbiddenException, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { MapperService } from "../../mapper-service/mapper.service";
import { UserRepository, UserAddStatus, UserUpdateStatus, UserDeleteStatus } from "../../../repositoires/user-repository/user.repository";
import { RoleRepository } from "../../../repositoires/role-repository/role.repository";
import { User, UserDto, Role, ManagersDeleteUserRequest } from "@monorepo/shared";
import { GetUserQuery } from "../../../repositoires/user-repository/queries/get-user.query";
import { AddUserCommand } from "../../../repositoires/user-repository/commands/add-user.command";
import { UpdateUserCommand } from "../../../repositoires/user-repository/commands/update-user.command";
import { DeleteUserCommand } from "../../../repositoires/user-repository/commands/delete-user.command";
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

            if (query.login || query.id) {
                const user = await this.userRepository.getUser(query);
                if (!user) {
                    throw new NotFoundException("Пользователь не найден");
                }

                if (user.login === managerLogin) {
                    return this.mapper.toDto<User, UserDto>(user);
                }

                if (user.role?.roleName?.toLowerCase() !== 'user') {
                    throw new ForbiddenException("Недостаточно прав для чтения информации об этом пользователе");
                }

                return this.mapper.toDto<User, UserDto>(user);
            }

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
            const role = await this.roleModel.findOne({ where: { id: command.roleId } });
            if (!role || role.roleName.toLowerCase() !== 'user') {
                throw new BadRequestException("Менеджер может создавать только обычных пользователей");
            }

            const salt = crypto.randomUUID();
            const hashedPassword = await bcrypt.hash(`${command.password.trim()}${salt}`, 10);

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

            if (command.login !== managerLogin && userToUpdate.role?.roleName?.toLowerCase() !== 'user') {
                throw new ForbiddenException("Недостаточно прав для обновления информации об этом пользователе");
            }

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

    public async deleteUser(req: ManagersDeleteUserRequest): Promise<number> {
        try {
            const userToDelete = await this.userModel.findOne({ where: { login: req.login }, include: [Role] });
            if (!userToDelete) {
                return 1; // not found
            }

            // Менеджер может удалять только пользователей с ролью "user"
            if (userToDelete.role?.roleName?.toLowerCase() !== 'user') {
                throw new ForbiddenException("Менеджер может удалять только обычных пользователей");
            }

            const command = new DeleteUserCommand({
                login: req.login
            });
            const result = await this.userRepository.deleteUser(command);
            return result === UserDeleteStatus.Success ? 0 : 2;
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            console.error("Ошибка при удалении пользователя:", error);
            return 2; // error
        }
    }
}
