// import { User, UserJwtData } from "@monorepo/shared";
// import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
// import { InjectModel } from "@nestjs/sequelize";

// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(@InjectModel(User) private readonly userModel: typeof User) { }

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const requiredRoles = ["admin", "manager"];

//         const request = context.switchToHttp().getRequest();
//         const userInfo = request[Constants.User] as UserJwtData;

//         if (!userInfo) return false;

//         const user = await this.userModel.findOne({
//             where: {
//                 login: userInfo.login
//             }
//         });

//         if (!user) return false;

//         const isPrivileged = requiredRoles.some(role => user.role.roleName == role);
//         if (isPrivileged) return true;

//         const targetLogin = request.params.login;

//         if (targetLogin && user.login === targetLogin) {
//             return true;
//         }

//         throw new ForbiddenException('Доступ запрещен: вы не админ и это не ваш профиль');
//     }
// }