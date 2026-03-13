import { ErrorBuilder, User, UserDto } from "@monorepo/shared";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
//import { IGetUserInfoRequest } from "./models/get-user-info.request";
import { MapperService } from "../../mapper-service/mapper.service";
import { AuthorizationService } from "../../authorization-service/authorization.service";
import { ICustomerUpdateUserInfoRequest } from "../models/customers/customers-update-user-info.request";
//import { IUpdateUserInfoRequest } from "./models/update-user-info.request";

@Injectable()
export class CustomerUserService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        private readonly mapper: MapperService,
        private readonly authorizationService: AuthorizationService) { }

    public async getUserInfo(login: string | null): Promise<UserDto> {
        const user = await this.getUserByLogin(login);

        if (!user) {
            throw new NotFoundException("Пользователь не найден");
        }

        return this.mapper.toDto<User, UserDto>(user);
    }

    public async updateUser(updateInfoRequest: ICustomerUpdateUserInfoRequest, user: User | null): Promise<UserDto> {
        if (!user) {
            throw new NotFoundException("Пользователь не найден");
        }


    }

    private async getUserByLogin(login: string | null): Promise<User | null> {
        return this.userModel.findOne({
            where: {
                login: login
            }
        });
    }
}

// public async updateUserInfo(getUserInfoRequest: IUpdateUserInfoRequest): Promise<UserDto> {
//     const user = await this.getUserByLogin(getUserInfoRequest.login);

//     if (!user) {
//         throw new Error("Пользователь не найден");
//     }



//     return this.mapper.toDto<User, UserDto>(user);
// }

