export class GetRoleQuery {
    id: number = 0;

    constructor(init?: Partial<GetRoleQuery>) {
        Object.assign(this, init);
    }
}