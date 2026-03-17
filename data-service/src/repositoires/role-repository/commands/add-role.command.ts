export class AddRoleCommand {
    roleName: string = '';

    constructor(init?: Partial<AddRoleCommand>) {
        Object.assign(this, init);
    }
}
