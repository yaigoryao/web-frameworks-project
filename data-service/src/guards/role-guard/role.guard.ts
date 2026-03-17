import { Role, User, UserJwtData } from "@monorepo/shared";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class RolesGuard implements CanActivate {
    private readonly allowedRoles: string[] = ['manager', 'owner'];
    constructor(@InjectModel(User) private readonly userModel: typeof User) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userLogin = request.login;
        const user = await this.userModel.findOne({ where: { login: userLogin }, include: [Role] });

        if (!user) {
            throw new UnauthorizedException("Пользователь не найден");
        }
        if (!this.allowedRoles.some(role => user?.role?.roleName?.toLocaleLowerCase() === role)) {
            throw new ForbiddenException("Недостаточно прав для выполнения данного действия");
        }
        return true;
    }
}