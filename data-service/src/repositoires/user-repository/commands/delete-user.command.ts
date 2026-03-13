export class DeleteUserCommand {
    login: string = '';

    constructor(init?: Partial<DeleteUserCommand>) {
        Object.assign(this, init);
    }
}