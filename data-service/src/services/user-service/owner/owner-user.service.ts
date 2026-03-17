import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { MapperService } from "../../mapper-service/mapper.service";
import { UserRepository, UserUpdateStatus } from "../../../repositoires/user-repository/user.repository";
import { User, UserDto, Role } from "@monorepo/shared";
import { GetUserQuery } from "../../../repositoires/user-repository/queries/get-user.query";
import { UpdateUserCommand } from "../../../repositoires/user-repository/commands/update-user.command";

@Injectable()
export class OwnerUserService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(Role) private readonly roleModel: typeof Role,
        private readonly userRepository: UserRepository,
        private readonly mapper: MapperService
    ) { }

    public async getUsers(query: GetUserQuery): Promise<UserDto | null> {
        try {
            // Если указан конкретный пользователь
            if (query.login || query.id) {
                const user = await this.userRepository.getUser(query);
                if (!user) {
                    throw new NotFoundException("Пользователь не найден");
                }
                return this.mapper.toDto<User, UserDto>(user);
            }

            throw new NotFoundException("Укажите login или id пользователя");
        }
        catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException("Ошибка при получении информации о пользователе");
        }
    }

    public async updateUser(command: UpdateUserCommand): Promise<UserUpdateStatus> {
        try {
            const userToUpdate = await this.userModel.findOne({ where: { login: command.login }, include: [Role] });
            if (!userToUpdate) {
                throw new NotFoundException("Пользователь не найден");
            }

            // Owner может обновлять любого пользователя на любую роль
            return await this.userRepository.updateUser(command);
        }
        catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException("Ошибка при обновлении информации о пользователе");
        }
    }
}
