export class AddUserCarCommand {
    userId: number = 0;
    carId: number = 0;
    ownsNow: boolean = true;

    constructor(init?: Partial<AddUserCarCommand>) {
        Object.assign(this, init);
    }
}
