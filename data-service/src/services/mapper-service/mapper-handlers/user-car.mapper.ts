import { Role, RoleDto, UserCar, UserCarDto } from "@monorepo/shared";
import { IDataMapper } from "./base.mapper";
import { MapperService } from "../mapper.service";
import { ModuleRef } from "@nestjs/core";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserCarMapper extends IDataMapper<UserCar, UserCarDto> {
    readonly entityConstructor = UserCar;

    toDto(entity: UserCar): UserCarDto {
        const dto = {
            userId: entity.userId,
            carId: entity.carId,
            ownsNow: entity.ownsNow
        } as UserCarDto;
        return dto;
    }
}