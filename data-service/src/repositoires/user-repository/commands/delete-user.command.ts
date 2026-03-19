import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class DeleteUserCommand {
    @IsString()
    @Type(() => String)
    login: string = '';

    constructor(init?: Partial<DeleteUserCommand>) {
        Object.assign(this, init);
    }
}