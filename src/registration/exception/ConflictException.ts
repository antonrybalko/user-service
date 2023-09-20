// Class for Repository Conflict Error

export class ConflictException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConflictException";
    }
}

