import { User } from '@monorepo/shared';
import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthorizationService {
    private static readonly requiredRoles = ["admin", "manager"];

    constructor(@InjectModel(User) private readonly userModel: typeof User) {

    }

    async validateUserRole(user: User): Promise<boolean> {
        try {
            if (!user) return false;
            const isPrivileged = AuthorizationService.requiredRoles.some(role => user.role.roleName == role);
            if (isPrivileged) return true;
            return false;
        }
        catch (error: unknown) {
            throw new InternalServerErrorException("Ошибка обработки ");
        }
    }
}