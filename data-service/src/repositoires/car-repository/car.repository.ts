import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Car, User } from '@monorepo/shared';
import { WhereOptions } from 'sequelize';
import { GetCarQuery } from './queries/get-car.query';
import { UpdateCarCommand } from './commands/update-car.command';

enum CarUpdateStatus {
    Success,
    NotFound,
    Error
}

@Injectable()
export class CarRepository {
    constructor(
        @InjectModel(Car) private readonly carRepository: typeof Car) { }

    async getCars(query: GetCarQuery): Promise<Car[] | null> {
        const whereOptions: WhereOptions = {};
        if (query.id) {
            whereOptions.id = query.id;
        }
        if (query.carNumber) {
            whereOptions.carNumber = query.carNumber;
        }
        if (query.vin) {
            whereOptions.vin = query.vin;
        }

        return this.carRepository.findAll({ where: whereOptions, limit: query.limit, offset: query.offset });
    }

    async updateCar(command: UpdateCarCommand): Promise<CarUpdateStatus> {
        try {
            const car = await this.carRepository.findOne({ where: { id: command.id } });
            if (!car) {
                return CarUpdateStatus.NotFound;
            }
            if (command.carNumber !== null) {
                car.carNumber = command.carNumber;
            }
            if (command.modelName !== null) {
                car.modelName = command.modelName;
            }
            if (command.vin !== null) {
                car.vin = command.vin;
            }
            if (command.color !== null) {
                car.color = command.color;
            }

            await car.save();
            return CarUpdateStatus.Success;
        }
        catch (error) {
            return CarUpdateStatus.Error;
        }
    }
}