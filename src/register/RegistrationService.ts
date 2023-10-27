import { RegistrationRepositoryInterface } from './RegistrationRepositoryInterface';
import { RegisterDto } from '../api/register/RegisterDto';
import { RegisteredUserDto } from '../api/register/RegisteredUserDto';
import { ConflictException } from '../shared/exception/ConflictException';
import {AuthService} from "../service/AuthService";
import {Inject} from "typedi";
import User from "../entity/User";

type RegistrationData = {
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    isVendor: boolean;
}
export class RegistrationService {
    @Inject('RegistrationRepositoryInterface')
    private registrationRepository: RegistrationRepositoryInterface;

    constructor(
        private authService: AuthService = new AuthService(),
    ) {}

    async registerUser(userData: RegistrationData): Promise<User> {
        if (await this.registrationRepository.checkIfUserExists(userData.username)) {
          throw new ConflictException('User with this username already exists');
        }

        if (await this.registrationRepository.checkIfEmailOrPhoneExists(userData.email, userData.phoneNumber)) {
          throw new ConflictException(
            'User with this email or phone number already exists.',
          );
        }

        const {username, password, email, phoneNumber, isVendor} = userData;
        const hashedPassword = await this.authService.hashPassword(password);

        return await this.registrationRepository.createUser(
            username,
            hashedPassword,
            email,
            phoneNumber,
            isVendor,
        );
    }
}
