import { Role, RoleDto } from "@monorepo/shared";
import { IDataMapper } from "./base.mapper";
import { MapperService } from "../mapper.service";
import { ModuleRef } from "@nestjs/core";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoleMapper extends IDataMapper<Role, RoleDto> {
    readonly entityConstructor = Role;

    toDto(entity: Role): RoleDto {
        const dto = {
            id: entity.id,
            roleName: entity.roleName,
        } as RoleDto;
        return dto;
    }
}