import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsJWT } from 'class-validator';
import { LoginResponse } from "../../../responses/login/login.response";

export class RefreshRequest extends LoginResponse { };