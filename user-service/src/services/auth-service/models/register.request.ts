import { ILoginRequest } from "./login.request";
export interface IRegisterRequest extends ILoginRequest {
    name: string;
    surname: string;
    patronymic?: string;
    phoneNumber: string;
    
 };