import { Type } from 'class-transformer';

export class UpdateRoleCommand {
    @Type(() => Number)
    id: number = 0;

    @Type(() => String)
    roleName: string | null = null;

    constructor(init?: Partial<UpdateRoleCommand>) {
        Object.assign(this, init);
    }
}