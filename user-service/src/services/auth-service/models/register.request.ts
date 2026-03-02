import { ILoginRequest } from "./login.request";
export interface IRegisterRequest extends ILoginRequest {
    login: string;
    name: string;
    password: string;
    surname: string;
    patronymic?: string;
    phoneNumber: string;
 };