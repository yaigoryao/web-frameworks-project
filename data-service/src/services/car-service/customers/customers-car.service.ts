import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { MapperService } from "../../mapper-service/mapper.service";
import { CarRepository } from "../../../repositoires/car-repository/car.repository";
import { UserRepository } from "../../../repositoires/user-repository/user.repository";
import { Car, CarDto } from "@monorepo/shared";
import { GetCarQuery } from "../../../repositoires/car-repository/queries/get-car.query";
import { CustomerGetCarQuery } from "../../../repositoires/car-repository/queries/customer-get-car.query";
import { GetUserQuery } from "../../../repositoires/user-repository/queries/get-user.query";

@Injectable()
export class CustomerCarService {
    constructor(
        private readonly carRepository: CarRepository,
        private readonly userRepository: UserRepository,
        private readonly mapper: MapperService
    ) { }

    /** Только автомобили текущего пользователя (по JWT login), игнорируя userId из query. */
    public async getCars(query: CustomerGetCarQuery, login: string): Promise<(CarDto | null)[]> {
        try {
            if (!login?.trim()) {
                return [];
            }
            const user = await this.userRepository.getUser(new GetUserQuery({ login: login.trim() }));
            if (!user) {
                return [];
            }
            const uid = Number(user.id);
            if (!Number.isFinite(uid) || uid < 1) {
                return [];
            }
            const repoQuery = new GetCarQuery({
                id: query.id,
                carNumber: query.carNumber,
                vin: query.vin,
                limit: query.limit,
                offset: query.offset,
                userId: uid,
            });
            const cars = await this.carRepository.getCars(repoQuery);
            return this.mapper.toDtos<Car, CarDto>(cars);
        }
        catch (error) {
            throw new InternalServerErrorException("Ошибка при получении информации о машинах");
        }
    }
}