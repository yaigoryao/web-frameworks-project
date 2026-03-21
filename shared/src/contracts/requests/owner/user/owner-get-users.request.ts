export class OwnerGetUsersRequest {
    id: number | null = null;
    login: string | null = null;

    constructor(init?: Partial<OwnerGetUsersRequest>) {
        Object.assign(this, init);
    }
}
