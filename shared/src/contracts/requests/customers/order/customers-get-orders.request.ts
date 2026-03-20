import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CustomerGetOrdersRequest {
    @ApiPropertyOptional({ description: 'Order start date', example: '2026-03-19T18:28:00.000+03:00' })
    startDate: Date | null = null;

    @ApiPropertyOptional({ description: 'Order end date', example: '2026-03-20T18:28:00.000+03:00' })
    endDate: Date | null = null;

    @ApiPropertyOptional({ description: 'Order status id', example: '1' })
    orderStatusId: number | null = null;

    @ApiProperty({ description: 'Result limit', example: 10, default: 0 })
    limit: number = 0;

    @ApiProperty({ description: 'Result offset', example: 10, default: 0 })
    offset: number = 0;

    constructor(init?: Partial<CustomerGetOrdersRequest>) {
        Object.assign(this, init);
    }
}
