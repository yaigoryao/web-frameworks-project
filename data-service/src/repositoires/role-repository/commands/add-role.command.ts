import { Type } from 'class-transformer';

export class AddRoleCommand {
    @Type(() => String)
    roleName: string = '';

    constructor(init?: Partial<AddRoleCommand>) {
        Object.assign(this, init);
    }
}
