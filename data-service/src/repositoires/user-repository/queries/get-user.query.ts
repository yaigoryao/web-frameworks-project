export class GetUserQuery {
    id: number | null = null;
    login: string | null = null;

    constructor(init?: Partial<GetUserQuery>) {
        Object.assign(this, init);
    }
}