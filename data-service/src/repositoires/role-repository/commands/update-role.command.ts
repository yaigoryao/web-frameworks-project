export class UpdateRoleCommand {
    id: number = 0;
    roleName: string | null = null;

    constructor(init?: Partial<UpdateRoleCommand>) {
        Object.assign(this, init);
    }
}