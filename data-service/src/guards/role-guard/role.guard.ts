import { Role, User, UserJwtData } from "@monorepo/shared";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { AuthorizationService } from "data-service/src/services/authorization-service/authorization.service";

@Injectable()
export class RolesGuard implements CanActivate {
    private readonly requiredRoles: string[] = ['manager', 'owner'];
    constructor(private readonly authorizationService: AuthorizationService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        return await this.authorizationService.authorizeUser(request.login, this.requiredRoles);
        // const userLogin = request.login;
        // const user = await this.userModel.findOne({ where: { login: userLogin }, include: [Role] });

        // if (!user) {
        //     throw new UnauthorizedException("Пользователь не найден");
        // }
        // if (!this.allowedRoles.some(role => user?.role?.roleName?.toLocaleLowerCase() === role)) {
        //     throw new ForbiddenException("Недостаточно прав для выполнения данного действия");
        // }
        // return true;
    }
}