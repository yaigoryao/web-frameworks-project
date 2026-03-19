import { Type } from 'class-transformer';

export class DeleteUserCommand {
    @Type(() => String)
    login: string = '';

    constructor(init?: Partial<DeleteUserCommand>) {
        Object.assign(this, init);
    }
}