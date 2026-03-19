import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateOrderStatusCommand {
    @IsNumber()
    @Type(() => Number)
    id: number = 0;

    @IsOptional()
    @IsString()
    @Type(() => String)
    orderStatusName: string | null = null;

    constructor(init?: Partial<UpdateOrderStatusCommand>) {
        Object.assign(this, init);
    }
}