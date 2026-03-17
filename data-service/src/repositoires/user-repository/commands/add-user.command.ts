export class AddUserCommand {
    login: string = '';
    password: string = '';
    salt: string = '';
    refreshToken: string = '';
    name: string = '';
    surname: string = '';
    patronymic: string | null = null;
    phoneNumber: string = '';
    isActive: boolean = true;
    roleId: number = 0;

    constructor(init?: Partial<AddUserCommand>) {
        Object.assign(this, init);
    }
}
