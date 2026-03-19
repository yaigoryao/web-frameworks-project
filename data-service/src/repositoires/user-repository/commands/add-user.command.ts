import { Type } from 'class-transformer';

export class AddUserCommand {
    @Type(() => String)
    login: string = '';

    @Type(() => String)
    password: string = '';

    @Type(() => String)
    salt: string = '';

    @Type(() => String)
    refreshToken: string = '';

    @Type(() => String)
    name: string = '';

    @Type(() => String)
    surname: string = '';

    @Type(() => String)
    patronymic: string | null = null;

    @Type(() => String)
    phoneNumber: string = '';

    @Type(() => Boolean)
    isActive: boolean = true;

    @Type(() => Number)
    roleId: number = 0;

    constructor(init?: Partial<AddUserCommand>) {
        Object.assign(this, init);
    }
}
