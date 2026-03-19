import { Type } from 'class-transformer';
import { MinLength, ValidateIf, IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class AddUserCommand {
    @IsString()
    @Type(() => String)
    login: string = '';

    @IsString()
    @Type(() => String)
    password: string = '';

    @IsString()
    @Type(() => String)
    salt: string = '';

    @IsString()
    @Type(() => String)
    refreshToken: string = '';

    @IsString()
    @Type(() => String)
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    name: string = '';

    @IsString()
    @Type(() => String)
    @MinLength(3, { message: 'Surname must be at least 3 characters long' })
    surname: string = '';

    @IsOptional()
    @IsString()
    @Type(() => String)
    @ValidateIf((o) => o.patronymic !== null)
    @MinLength(3, { message: 'Patronymic must be at least 3 characters long' })
    patronymic: string | null = null;

    @IsString()
    @Type(() => String)
    phoneNumber: string = '';

    @IsBoolean()
    @Type(() => Boolean)
    isActive: boolean = true;

    @IsNumber()
    @Type(() => Number)
    roleId: number = 0;

    constructor(init?: Partial<AddUserCommand>) {
        Object.assign(this, init);
    }
}
