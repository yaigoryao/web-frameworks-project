export class ManagersUpdateUserRequest {
    login: string = '';
    name: string | null = null;
    surname: string | null = null;
    patronymic: string | null = null;
    phoneNumber: string | null = null;
    roleId: number | null = null;

    constructor(init?: Partial<ManagersUpdateUserRequest>) {
        Object.assign(this, init);
    }
}
