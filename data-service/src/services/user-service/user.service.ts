import { ErrorBuilder, User, UserDto } from "@monorepo/shared";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IGetUserInfoRequest } from "./models/get-user-info.request";
import { MapperService } from "../mapper-service/mapper.service";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        private readonly mapper: MapperService
    ) { }

    public async getUserInfo(
        getUserInfoRequest: IGetUserInfoRequest
    ): Promise<UserDto> {
        const user = await this.userModel.findOne({
            where: {
                login: getUserInfoRequest.login
            }
        });

        if (user === null) {
            throw new NotFoundException("Пользователь не найден");
        }

        return this.mapper.toDto<User, UserDto>(user);
    }

    public async updateUserInfo(
        getUserInfoRequest: IGetUserInfoRequest
    ): Promise<UserDto> {
        const user = await this.userModel.findOne({
            where: {
                login: getUserInfoRequest.login
            }
        });

        if (user === null) {
            throw new Error("Пользователь не найден");
        }

        return this.mapper.toDto<User, UserDto>(user);
    }
}