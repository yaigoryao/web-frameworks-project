import { Type } from 'class-transformer';
import { Length, Matches, Min, Max, IsNumber, ValidateIf, IsString, IsOptional } from 'class-validator';

export class UpdateCarCommand {
    @IsNumber()
    @Type(() => Number)
    id: number = 0;

    @IsOptional()
    @IsString()
    @Type(() => String)
    carNumber: string | null = null;

    @IsOptional()
    @IsString()
    @Type(() => String)
    modelName: string | null = null;

    @IsOptional()
    @IsString()
    @Type(() => String)
    @ValidateIf((o) => o.vin !== null)
    @Length(17, 17, { message: 'VIN must be exactly 17 characters long' })
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'VIN must contain only letters and numbers' })
    vin: string | null = null;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ValidateIf((o) => o.color !== null)
    @Min(0, { message: 'Color must be between 0 and 9' })
    @Max(9, { message: 'Color must be between 0 and 9' })
    color: number | null = null;

    constructor(init?: Partial<UpdateCarCommand>) {
        Object.assign(this, init);
    }
}