import { Type } from 'class-transformer';

export class UpdateUserCommand {
    @Type(() => String)
    login: string = '';

    @Type(() => String)
    password: string | null = null;

    @Type(() => String)
    name: string | null = null;

    @Type(() => String)
    surname: string | null = null;

    @Type(() => String)
    patronymic: string | null = null;

    @Type(() => Boolean)
    isActive: boolean | null = null;

    @Type(() => String)
    phoneNumber: string | null = null;

    @Type(() => Number)
    roleId: number | null = null;

    constructor(init?: Partial<UpdateUserCommand>) {
        Object.assign(this, init);
    }
}
