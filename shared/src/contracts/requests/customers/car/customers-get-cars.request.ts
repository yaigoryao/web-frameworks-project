import { ApiProperty } from "@nestjs/swagger";

export class CustomerGetCarsRequest {

    @ApiProperty({ description: 'Result limit', example: 10, default: 0 })
    limit: number = 0;

    @ApiProperty({ description: 'Result offset', example: 10, default: 0 })
    offset: number = 0;

    constructor(init?: Partial<CustomerGetCarsRequest>) {
        Object.assign(this, init);
    }
}
