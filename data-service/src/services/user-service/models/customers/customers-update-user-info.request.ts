export interface ICustomerUpdateUserInfoRequest {
    login: string;
    name: string | null;
    password: string | null;
    surname: string | null;
    patronymic: string | null;
    phoneNumber: string | null;
}