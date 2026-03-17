import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Car, Role, User, UserCar } from '@monorepo/shared';
import { WhereOptions } from 'sequelize';
import { UpdateUserCarCommand } from './commands/update-user-car.command';
import { GetCarQuery } from '../car-repository/queries/get-car.query';
import { GetUserCarQuery } from './queries/get-user-car.query';

enum UserCarUpdateStatus {
    Success,
    NotFound,
    Error
}

@Injectable()
export class UserCarRepository {
    constructor(
        @InjectModel(UserCar) private readonly userCarRepository: typeof UserCar) { }

    async getUsersCars(query: GetUserCarQuery): Promise<UserCar[] | null> {
        const whereOptions: WhereOptions = {};
        if (query.userId) {
            whereOptions.userId = query.userId;
        }
        if (query.carId) {
            whereOptions.carId = query.carId;
        }
        if (query.ownsNow !== null) {
            whereOptions.ownsNow = query.ownsNow;
        }
        return this.userCarRepository.findAll({ where: whereOptions, limit: query.limit, offset: query.offset });
    }

    async updateUserCar(command: UpdateUserCarCommand): Promise<UserCarUpdateStatus> {
        try {

            const whereOptions: WhereOptions = {};
            if (command.userId) {
                whereOptions.userId = command.userId;
            }
            if (command.carId) {
                whereOptions.carId = command.carId;
            }

            const userCar = await this.userCarRepository.findOne({ where: whereOptions });
            if (!userCar) {
                return UserCarUpdateStatus.NotFound;
            }
            if (command.ownsNow !== null) {
                userCar.ownsNow = command.ownsNow;
            }

            await userCar.save();
            return UserCarUpdateStatus.Success;
        }
        catch (error) {
            return UserCarUpdateStatus.Error;
        }
    }
}