export function splitErrorMessage(err: Error) {
    return err.message.split(';');
}

export class ErrorBuilder {
    private errorMessages: string[] = [];

    addErrorMessage(message: string) {
        this.errorMessages.push(message);
        return this;
    }

    build(): Error {
        return new Error(this.errorMessages.join(';'));
    }

    hasErrors(): boolean {
        return this.errorMessages.length > 0; 
    }
}