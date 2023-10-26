export enum UserStatus {
    REGISTERED = 0,
    ACTIVE = 1,
    DELETED = 2,
    BLOCKED = 3,
}

export const DefaultUserStatus = UserStatus.ACTIVE;

export default class User {
    constructor(
        private guid: string,
        private username: string,
        private isAdmin: boolean,
        private isVendor: boolean,
        private phoneNumber?: string,
        private email?: string,
        private oauthProvider?: string,
        private vkId?: string,
        private googleId?: string,
        private status: UserStatus = DefaultUserStatus,
    ) { }

    public isActive(): boolean {
        return this.status === UserStatus.ACTIVE;
    }

    public isBlocked(): boolean {
        return this.status === UserStatus.BLOCKED;
    }

    public isDeleted(): boolean {
        return this.status === UserStatus.DELETED;
    }
}
