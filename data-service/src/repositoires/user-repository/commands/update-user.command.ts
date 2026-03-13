export class UpdateUserCommand {
    login: string = '';
    password: string | null = null;
    name: string | null = null;
    surname: string | null = null;
    patronymic: string | null = null;
    isActive: boolean | null = null;
    phoneNumber: string | null = null;
    roleId: number | null = null;

    constructor(init?: Partial<UpdateUserCommand>) {
        Object.assign(this, init);
    }
}
