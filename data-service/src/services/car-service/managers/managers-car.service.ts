import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { MapperService } from "../../mapper-service/mapper.service";
import { CarRepository, CarAddStatus, CarUpdateStatus } from "../../../repositoires/car-repository/car.repository";
import { UserCarRepository } from "../../../repositoires/user-car-repository/user-car.repository";
import { Car, CarDto, ManagersDeleteUserCarRequest } from "@monorepo/shared";
import { GetCarQuery } from "../../../repositoires/car-repository/queries/get-car.query";
import { AddCarCommand } from "../../../repositoires/car-repository/commands/add-car.command";
import { UpdateCarCommand } from "../../../repositoires/car-repository/commands/update-car.command";

@Injectable()
export class ManagersCarService {
    constructor(
        private readonly carRepository: CarRepository,
        private readonly userCarRepository: UserCarRepository,
        private readonly mapper: MapperService
    ) { }

    public async getCars(query: GetCarQuery): Promise<(CarDto | null)[]> {
        try {
            const cars = await this.carRepository.getCars(query);
            return this.mapper.toDtos<Car, CarDto>(cars || []);
        }
        catch (error) {
            throw new InternalServerErrorException("Ошибка при получении информации о машинах");
        }
    }

    public async addCar(command: AddCarCommand): Promise<CarAddStatus> {
        try {
            return await this.carRepository.addCar(command);
        }
        catch (error) {
            throw new InternalServerErrorException("Ошибка при добавлении машины");
        }
    }

    public async updateCar(command: UpdateCarCommand): Promise<CarUpdateStatus> {
        try {
            return await this.carRepository.updateCar(command);
        }
        catch (error) {
            throw new InternalServerErrorException("Ошибка при обновлении информации о машине");
        }
    }

    public async deleteUserCar(req: ManagersDeleteUserCarRequest): Promise<number> {
        try {
            const result = await this.userCarRepository.deleteUserCar(req.userId, req.carId);
            return result ? 0 : 1; // 0 = success, 1 = not found / error
        }
        catch (error) {
            console.error("Ошибка при удалении связи пользователя и машины:", error);
            return 2; // error
        }
    }
}
