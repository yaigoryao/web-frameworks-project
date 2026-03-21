import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Car, Role, User } from '@monorepo/shared';
import { WhereOptions } from 'sequelize';
import { GetRoleQuery } from './queries/get-role.query';
import { UpdateRoleCommand } from './commands/update-role.command';
import { AddRoleCommand } from './commands/add-role.command';

export enum RoleAddStatus {
    Success,
    Error
}

export enum RoleUpdateStatus {
    Success,
    NotFound,
    Error
}

@Injectable()
export class RoleRepository {
    constructor(
        @InjectModel(Role) private readonly roleRepository: typeof Role) { }

    async getRole(query: GetRoleQuery): Promise<Role[]> {
        const whereOptions: WhereOptions = {};
        if (query.id) {
            whereOptions.id = query.id;
        }
        return this.roleRepository.findAll({ where: whereOptions, limit: query.limit, offset: query.offset });
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

    async addRole(command: AddRoleCommand): Promise<RoleAddStatus> {
        try {
            const role = this.roleRepository.build({
                roleName: command.roleName
            } as any);
            await role.save();
            return RoleAddStatus.Success;
        }
        catch (error) {
            return RoleAddStatus.Error;
        }
    }
}