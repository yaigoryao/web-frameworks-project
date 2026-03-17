import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Car, User } from '@monorepo/shared';
import { WhereOptions } from 'sequelize';
import { GetCarQuery } from './queries/get-car.query';
import { UpdateCarCommand } from './commands/update-car.command';
import { AddCarCommand } from './commands/add-car.command';

export enum CarAddStatus {
    Success,
    Error
}

export enum CarUpdateStatus {
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

    async addCar(command: AddCarCommand): Promise<CarAddStatus> {
        try {
            const car = this.carRepository.build({
                carNumber: command.carNumber,
                modelName: command.modelName,
                vin: command.vin,
                color: command.color
            } as any);
            await car.save();
            return CarAddStatus.Success;
        }
        catch (error) {
            return CarAddStatus.Error;
        }
    }
}