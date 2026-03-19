import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role, User } from '@monorepo/shared';
import { WhereOptions } from 'sequelize';
import { GetUserQuery } from './queries/get-user.query';
import { UpdateUserCommand } from './commands/update-user.command';
import { DeleteUserCommand } from './commands/delete-user.command';
import { AddUserCommand } from './commands/add-user.command';
import bcrypt from 'bcrypt';

export enum UserAddStatus {
    Success,
    Error
}

export enum UserUpdateStatus {
    Success,
    NotFound,
    Error
}

export enum UserDeleteStatus {
    Success,
    NotFound,
    Error
}

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User) private readonly userRepository: typeof User) { }

    async getUser(query: GetUserQuery): Promise<User | null> {
        const whereOptions: WhereOptions = {};
        if (query.id) {
            whereOptions.id = query.id;
        }
        if (query.login) {
            whereOptions.login = query.login;
        }

        return this.userRepository.findOne({ where: whereOptions, include: [Role] });
    }

    async updateUser(command: UpdateUserCommand): Promise<UserUpdateStatus> {
        try {
            const user = await this.userRepository.findOne({ where: { login: command.login } });
            if (!user) {
                return UserUpdateStatus.NotFound;
            }
            if (command.name !== null) {
                user.name = command.name;
            }
            if (command.surname !== null) {
                user.surname = command.surname;
            }
            if (command.patronymic !== null) {
                user.patronymic = command.patronymic;
            }
            if (command.isActive !== null) {
                user.isActive = command.isActive;
            }
            if (command.phoneNumber !== null) {
                user.phoneNumber = command.phoneNumber;
            }
            if (command.roleId !== null) {
                user.roleId = command.roleId;
            }
            if (command.password !== null) {

                let salt = crypto.randomUUID();
                user.salt = salt;
                user.password = await bcrypt.hash(`${command.password}${salt}`, 10);
            }
            await user.save();
            return UserUpdateStatus.Success;
        }
        catch (error) {
            return UserUpdateStatus.Error;
        }
    }

    async deleteUser(command: DeleteUserCommand): Promise<UserDeleteStatus> {
        try {
            const user = await this.userRepository.findOne({ where: { login: command.login } });
            if (!user) {
                return UserDeleteStatus.NotFound;
            }
            user.isActive = false;
            await user.destroy();
            return UserDeleteStatus.Success;
        }
        catch (error) {
            return UserDeleteStatus.Error;
        }
    }

    async addUser(command: AddUserCommand): Promise<UserAddStatus> {
        try {
            const user = this.userRepository.build({
                login: command.login,
                password: command.password,
                salt: command.salt,
                refreshToken: command.refreshToken,
                name: command.name,
                surname: command.surname,
                patronymic: command.patronymic,
                phoneNumber: command.phoneNumber,
                isActive: command.isActive,
                roleId: command.roleId
            } as any);
            await user.save();
            return UserAddStatus.Success;
        }
        catch (error) {
            return UserAddStatus.Error;
        }
    }
}