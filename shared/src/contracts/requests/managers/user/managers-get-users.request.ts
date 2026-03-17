export class ManagersGetUsersRequest {
    id: number | null = null;
    login: string | null = null;

    constructor(init?: Partial<ManagersGetUsersRequest>) {
        Object.assign(this, init);
    }
}
