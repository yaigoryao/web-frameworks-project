export class CustomerUpdateUserRequest {
    login!: string;
    name: string | null = null;
    password: string | null = null;
    surname: string | null = null;
    patronymic: string | null = null;
    phoneNumber: string | null = null;

    constructor(init?: Partial<CustomerUpdateUserRequest>) {
        Object.assign(this, init);
    }
}