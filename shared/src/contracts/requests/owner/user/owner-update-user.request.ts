export class OwnerUpdateUserRequest {
    login: string = '';
    name: string | null = null;
    surname: string | null = null;
    patronymic: string | null = null;
    phoneNumber: string | null = null;
    roleId: number | null = null;

    constructor(init?: Partial<OwnerUpdateUserRequest>) {
        Object.assign(this, init);
    }
}
