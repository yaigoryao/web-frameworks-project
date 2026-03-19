import { Role, User } from "@monorepo/shared";
import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { AuthorizationService } from "data-service/src/services/authorization-service/authorization.service";

@Injectable()
export class OwnerGuard implements CanActivate {
    private readonly requiredRoles = ["owner"];
    constructor(private authorizationService: AuthorizationService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        //const user = await this.userModel.findOne({ where: { login: userLogin }, include: [Role] });
        return await this.authorizationService.authorizeUser(request.login, this.requiredRoles);

        // return await this.ownerUserService.getUsers(query);
        // if (!user) {
        //     throw new UnauthorizedException("Пользователь не найден");
        // }
        // if (user?.role?.roleName?.toLowerCase() !== 'owner') {
        //     throw new ForbiddenException("Недостаточно прав для выполнения данного действия");
        // }
        // return true;
    }
}
