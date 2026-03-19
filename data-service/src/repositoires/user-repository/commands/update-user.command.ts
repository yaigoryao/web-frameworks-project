import { Type } from 'class-transformer';
import { MinLength, ValidateIf, IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserCommand {
    @IsString()
    @Type(() => String)
    login: string = '';

    @IsOptional()
    @IsString()
    @Type(() => String)
    password: string | null = null;

    @IsOptional()
    @IsString()
    @Type(() => String)
    @ValidateIf((o) => o.name !== null)
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    name: string | null = null;

    @IsOptional()
    @IsString()
    @Type(() => String)
    @ValidateIf((o) => o.surname !== null)
    @MinLength(3, { message: 'Surname must be at least 3 characters long' })
    surname: string | null = null;

    @IsOptional()
    @IsString()
    @Type(() => String)
    @ValidateIf((o) => o.patronymic !== null)
    @MinLength(3, { message: 'Patronymic must be at least 3 characters long' })
    patronymic: string | null = null;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    isActive: boolean | null = null;

    @IsOptional()
    @IsString()
    @Type(() => String)
    phoneNumber: string | null = null;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    roleId: number | null = null;

    constructor(init?: Partial<UpdateUserCommand>) {
        Object.assign(this, init);
    }
}
