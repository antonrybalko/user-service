import { UserStatus } from '../../persistence/entity/UserEntity';

export class RegisteredUserDto {
    constructor(
        public guid: string,
        public username: string,
        public email: string,
        public phoneNumber: string,
        public isVendor: boolean,
        public status: UserStatus,
    ) { }
}
