import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Car, Role, User } from '@monorepo/shared';
import { WhereOptions } from 'sequelize';

enum RoleUpdateStatus {
    Success,
    NotFound,
    Error
}

@Injectable()
export class RoleRepository {
    constructor(
        @InjectModel(Role) private readonly roleRepository: typeof Role) { }

    async getRole(query: GetRoleQuery): Promise<Role | null> {
        const whereOptions: WhereOptions = {};
        if (query.id) {
            whereOptions.id = query.id;
        }
        return this.roleRepository.findOne({ where: whereOptions });
    }

    async updateRole(command: UpdateRoleCommand): Promise<RoleUpdateStatus> {
        try {
            const role = await this.roleRepository.findOne({ where: { id: command.id } });
            if (!role) {
                return RoleUpdateStatus.NotFound;
            }
            if (command.roleName !== null) {
                role.roleName = command.roleName;
            }

            await role.save();
            return RoleUpdateStatus.Success;
        }
        catch (error) {
            return RoleUpdateStatus.Error;
        }
    }
}