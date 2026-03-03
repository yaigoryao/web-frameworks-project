import { ErrorBuilder, User } from "@monorepo/shared";
import { Get, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IGetUserInfoRequest } from "./models/get-user-info.request";

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private readonly userModel: typeof User) {
    }

    @Get()
    async getUserInfo(getUserInfoRequest: IGetUserInfoRequest): Promise<User> {
        const errBuilder = new ErrorBuilder();
        const user = await this.userModel.findByPk(getUserInfoRequest.id);
        if (user === null) {
            throw errBuilder.addErrorMessage("Пользователь не найден");
        }


        if (errBuilder.hasErrors()) {
            throw errBuilder.build();
        }

    }
}