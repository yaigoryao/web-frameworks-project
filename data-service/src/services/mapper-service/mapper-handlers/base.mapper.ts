export abstract class IDataMapper<TEntity, TDto> {
    abstract readonly entityConstructor: new (...args: any[]) => TEntity;
    abstract toDto(entity: TEntity): TDto;
}