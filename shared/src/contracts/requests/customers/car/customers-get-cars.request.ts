import { IsNumber, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";

export class CustomerGetCarsRequest {

    @ApiProperty({ description: 'Result limit', example: 10, default: 0 })
    @IsNotEmpty({ message: 'Limit cannot be empty' })
    @IsNumber()
    @Min(0, { message: 'Limit must be a non-negative number' })
    @Type(() => Number)
    limit: number = 0;

    @ApiProperty({ description: 'Result offset', example: 10, default: 0 })
    @IsNotEmpty({ message: 'Offset cannot be empty' })
    @IsNumber()
    @Min(0, { message: 'Offset must be a non-negative number' })
    @Type(() => Number)
    offset: number = 0;

    constructor(init?: Partial<CustomerGetCarsRequest>) {
        Object.assign(this, init);
    }
}
