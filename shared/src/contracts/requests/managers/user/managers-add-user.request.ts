export class ManagersAddUserRequest {
    login: string = '';
    password: string = '';
    name: string = '';
    surname: string = '';
    patronymic: string | null = null;
    phoneNumber: string = '';
    roleId: number = 0;

    constructor(init?: Partial<ManagersAddUserRequest>) {
        Object.assign(this, init);
    }
}
