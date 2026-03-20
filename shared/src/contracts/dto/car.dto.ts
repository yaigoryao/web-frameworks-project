import { ApiProperty } from "@nestjs/swagger";

export class CarDto {
    @ApiProperty({ description: 'Car ID', example: 1 })
    declare id: number;

    @ApiProperty({ description: 'Car number', example: 'A123BC' })
    declare carNumber: string;

    @ApiProperty({ description: 'Car model name', example: 'Nissasn Note' })
    declare modelName: string;

    @ApiProperty({ description: 'VIN', example: 'AAA00000000000000' })
    declare vin: string;

    @ApiProperty({ description: 'Car color code', example: 0 })
    declare color: number;
}