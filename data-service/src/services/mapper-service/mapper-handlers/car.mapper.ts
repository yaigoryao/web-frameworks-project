import { Car, CarDto } from "@monorepo/shared";
import { IDataMapper } from "./base.mapper";
import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { MapperService } from "../mapper.service";

@Injectable()
export class CarMapper extends IDataMapper<Car, CarDto> {
    readonly entityConstructor = Car;

    private mappingService: MapperService = null!;

    toDto(entity: Car): CarDto {
        const dto = {
            id: entity.id,
            carNumber: entity.carNumber,
            modelName: entity.modelName,
            vin: entity.vin,
            color: entity.color,
        } as CarDto;
        return dto;
    }
}