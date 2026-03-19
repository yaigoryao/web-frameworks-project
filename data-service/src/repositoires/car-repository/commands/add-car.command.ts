import { Type } from 'class-transformer';
import { Length, Matches, Min, Max, IsNumber, IsString } from 'class-validator';

export class AddCarCommand {
    @IsString()
    @Type(() => String)
    carNumber: string = '';

    @IsString()
    @Type(() => String)
    modelName: string = '';

    @IsString()
    @Type(() => String)
    @Length(17, 17, { message: 'VIN must be exactly 17 characters long' })
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'VIN must contain only letters and numbers' })
    vin: string = '';

    @IsNumber()
    @Type(() => Number)
    @Min(0, { message: 'Color must be between 0 and 9' })
    @Max(9, { message: 'Color must be between 0 and 9' })
    color: number = 9;

    constructor(init?: Partial<AddCarCommand>) {
        Object.assign(this, init);
    }
}
