import { Car, CarDto, ErrorBuilder, User, UserDto } from "@monorepo/shared";
import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
//import { IGetUserInfoRequest } from "./models/get-user-info.request";
import { MapperService } from "../../mapper-service/mapper.service";
import { AuthorizationService } from "../../authorization-service/authorization.service";
import { UserRepository, UserUpdateStatus } from "data-service/src/repositoires/user-repository/user.repository";
import { GetUserQuery } from "data-service/src/repositoires/user-repository/queries/get-user.query";
import { UpdateUserCommand } from "data-service/src/repositoires/user-repository/commands/update-user.command";
import { CarRepository } from "data-service/src/repositoires/car-repository/car.repository";
import { GetCarQuery } from "data-service/src/repositoires/car-repository/queries/get-car.query";
//import { IUpdateUserInfoRequest } from "./models/update-user-info.request";

@Injectable()
export class CustomerCarService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        private readonly mapper: MapperService,
        private readonly carRepository: CarRepository) { }

    public async getCarsInfo(): Promise<CarDto[]> {
        let cars: Car[] | null = null;
        try {
            cars = await this.carRepository.getCars(new GetCarQuery());
        }
        catch (error) {
            throw new InternalServerErrorException("Ошибка при получении информации о пользователе");
        }

        try {
            return this.mapper.toDtos<Car, CarDto>(cars!);
        }
        catch (error) {
            throw new InternalServerErrorException("Ошибка при обработке запроса!");
        }
    }
}

// public async updateUserInfo(getUserInfoRequest: IUpdateUserInfoRequest): Promise<UserDto> {
//     const user = await this.getUserByLogin(getUserInfoRequest.login);

//     if (!user) {
//         throw new Error("Пользователь не найден");
//     }



//     return this.mapper.toDto<User, UserDto>(user);
// }

