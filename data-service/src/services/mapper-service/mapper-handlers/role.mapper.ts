import { RoleDto } from "@monorepo/shared";
import { IDataMapper } from "./base.mapper.js";
import { MapperService } from "../mapper.service.js";
import { ModuleRef } from "@nestjs/core";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoleMapper extends IDataMapper<RoleDto, RoleDto> {
    readonly entityConstructor = RoleDto;

    toDto(entity: RoleDto): RoleDto {
        const dto = {
            id: entity.id,
            roleName: entity.roleName,
            description: entity.description,
        } as RoleDto;
        return dto;
    }
}