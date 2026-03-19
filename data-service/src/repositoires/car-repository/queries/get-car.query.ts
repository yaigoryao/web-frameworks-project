import { Type } from 'class-transformer';
import { Length, Matches, ValidateIf, IsNumber, IsString, IsOptional } from 'class-validator';

export class GetCarQuery {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id: number | null = null;

    @IsOptional()
    @IsString()
    @Type(() => String)
    carNumber: string | null = null;

    @IsOptional()
    @IsString()
    @Type(() => String)
    @ValidateIf((o) => o.vin !== null)
    @Length(17, 17, { message: 'VIN must be exactly 17 characters long' })
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'VIN must contain only letters and numbers' })
    vin: string | null = null;

    @IsNumber()
    @Type(() => Number)
    limit: number = 0;

    @IsNumber()
    @Type(() => Number)
    offset: number = 0;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    userId: number | null = null;

    constructor(init?: Partial<GetCarQuery>) {
        Object.assign(this, init);
    }
}