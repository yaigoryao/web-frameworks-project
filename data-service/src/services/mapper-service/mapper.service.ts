import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { MAPPERS_TOKEN } from "../../app.module";
import { IDataMapper } from "./mapper-handlers/base.mapper";

@Injectable()
export class MapperService {
    //constructor(@Inject(MAPPERS_TOKEN) private readonly mappers: IDataMapper<any, any>[]) {
    //constructor(@Inject(MAPPERS_TOKEN) private readonly mappers: IDataMapper<any, any>[]) {
    constructor(@Inject(forwardRef(() => MAPPERS_TOKEN)) private readonly mappers: IDataMapper<any, any>[]) {
    }

    toDto<TEntity, TDto>(entity: TEntity): TDto {
        const mapper = this.mappers.find(m => entity instanceof m.entityConstructor);
        if (mapper === undefined) {
            throw new Error("Не найден соответствующий маппер");
        }
        return mapper.toDto(entity);
    }

    toDtos<TEntity, TDto>(entities: TEntity[]): TDto[] {
        return entities.map(entity => this.toDto(entity));
    }

}