import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddOrderStatusCommand {
    @ApiProperty({ description: 'Order status name', example: 'Confirmed' })
    @IsString()
    @Type(() => String)
    orderStatusName: string = '';

    constructor(init?: Partial<AddOrderStatusCommand>) {
        Object.assign(this, init);
    }
}
