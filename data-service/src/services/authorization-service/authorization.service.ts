import { Role, User } from '@monorepo/shared';
import { ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthorizationService {
    //#private static readonly requiredRoles = ["admin", "manager"];

    constructor(@InjectModel(User) private readonly userModel: typeof User) {

    }

    public async authorizeUser(login: string | null, role: string | null, requiredRoles: string[]): Promise<boolean> {
        if (!login) throw new UnauthorizedException("Пользователь не найден");

        //const user = await this.userModel.findOne({ where: { login: login! }, include: [Role] });

        if (!role) {
            throw new UnauthorizedException("Роль пользователя не указаана");
        }
        if (!requiredRoles.includes(role)) {
            throw new ForbiddenException("Недостаточно прав для выполнения данного действия");
        }
        return true;
        // if (!user) return false;
        // const isPrivileged = AuthorizationService.requiredRoles.some(role => user.role.roleName == role);
        // if (isPrivileged) return true;
        // return false;
    }
}