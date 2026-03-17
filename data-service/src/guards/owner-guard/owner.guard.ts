import { Role, User } from "@monorepo/shared";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class OwnerGuard implements CanActivate {
    constructor(@InjectModel(User) private readonly userModel: typeof User) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userLogin = request.login;
        const user = await this.userModel.findOne({ where: { login: userLogin }, include: [Role] });

        if (!user) {
            throw new UnauthorizedException("Пользователь не найден");
        }
        if (user?.role?.roleName?.toLowerCase() !== 'owner') {
            throw new ForbiddenException("Недостаточно прав для выполнения данного действия");
        }
        return true;
    }
}
