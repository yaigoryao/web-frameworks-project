import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderStatusCommand {
    @ApiProperty({ description: 'Order status ID to update', example: 1 })
    @IsNumber()
    @Type(() => Number)
    id: number = 0;

    @ApiPropertyOptional({ description: 'Order status name', example: 'Confirmed' })
    @IsOptional()
    @IsString()
    @Type(() => String)
    orderStatusName: string | null = null;

    constructor(init?: Partial<UpdateOrderStatusCommand>) {
        Object.assign(this, init);
    }
}