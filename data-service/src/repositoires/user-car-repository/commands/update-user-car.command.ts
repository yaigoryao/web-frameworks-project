export class UpdateUserCarCommand {
    userId: number = 0;
    carId: number = 0;
    ownsNow: boolean | null = null;

    constructor(init?: Partial<UpdateUserCarCommand>) {
        Object.assign(this, init);
    }
}