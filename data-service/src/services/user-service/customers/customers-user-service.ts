import { ErrorBuilder, User, UserDto } from "@monorepo/shared";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
//import { IGetUserInfoRequest } from "./models/get-user-info.request";
import { MapperService } from "../../mapper-service/mapper.service";
import { AuthorizationService } from "../../authorization-service/authorization.service";
import { CustomerUpdateUserRequest } from "../models/customers/customers-update-user-info.request";
import { UserRepository, UserUpdateStatus } from "data-service/src/repositoires/user-repository/user.repository";
import { GetUserQuery } from "data-service/src/repositoires/user-repository/queries/get-user.query";
import { UpdateUserCommand } from "data-service/src/repositoires/user-repository/commands/update-user.command";
//import { IUpdateUserInfoRequest } from "./models/update-user-info.request";

@Injectable()
export class CustomerUserService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        private readonly mapper: MapperService,
        private readonly userRepository: UserRepository) { }

    public async getUserInfo(login: string | null): Promise<UserDto> {
        const user = await this.userRepository.getUser(new GetUserQuery({ login: login }));

        if (!user) {
            throw new NotFoundException("Пользователь не найден");
        }

        return this.mapper.toDto<User, UserDto>(user);
    }

    public async updateUser(updateInfoRequest: CustomerUpdateUserRequest): Promise<UserUpdateStatus> {
        return await this.userRepository.updateUser(new UpdateUserCommand(updateInfoRequest));
    }
}

// public async updateUserInfo(getUserInfoRequest: IUpdateUserInfoRequest): Promise<UserDto> {
//     const user = await this.getUserByLogin(getUserInfoRequest.login);

//     if (!user) {
//         throw new Error("Пользователь не найден");
//     }



//     return this.mapper.toDto<User, UserDto>(user);
// }

