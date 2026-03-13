import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@monorepo/shared';
import { WhereOptions } from 'sequelize';
import { GetUserQuery } from './queries/get-user.query';
import { UpdateUserCarCommand } from '../user-car-repository/commands/update-user-car.command';
import { UpdateUserCommand } from './commands/update-user.command';
import { DeleteUserCommand } from './commands/delete-user.command';

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
            whereOptions.login = query.id;
        }
        if (query.login) {
            whereOptions.login = query.login;
        }

        return this.userRepository.findOne({ where: whereOptions });
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
}