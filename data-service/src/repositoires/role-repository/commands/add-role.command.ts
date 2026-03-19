import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class AddRoleCommand {
    @IsString()
    @Type(() => String)
    roleName: string = '';

    constructor(init?: Partial<AddRoleCommand>) {
        Object.assign(this, init);
    }
}
