import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { MapperService } from "../../mapper-service/mapper.service";
import { CarRepository } from "../../../repositoires/car-repository/car.repository";
import { Car, CarDto } from "@monorepo/shared";
import { GetCarQuery } from "../../../repositoires/car-repository/queries/get-car.query";

@Injectable()
export class CustomerCarService {
    constructor(
        private readonly carRepository: CarRepository,
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
}