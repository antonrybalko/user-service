import {Repository} from 'typeorm';
import User, {DefaultUserStatus } from '../../entity/User';
import {UserEntity} from '../entity/UserEntity';
import {AppDataSource} from "../data-source";

export class RegistrationRepository extends Repository<UserEntity>   {

    async checkIfUserExists(username: string): Promise<boolean> {
        // Check for existing user
        const usernameExists = await this.findOne({
            where: [{ username }],
        });
        return !!usernameExists;
    }

    async checkIfEmailOrPhoneExists(email: string, phoneNumber:string): Promise<boolean> {
        // Check for existing user
        const emailOrPhoneExists = await this.findOne({
            where: [{ email }, { phoneNumber }],
        });
        return !!emailOrPhoneExists;
    }

    async createUser(username: string, password: string, email: string, phoneNumber: string, isVendor: boolean): Promise<User> {
        const userRepository = AppDataSource.getRepository(UserEntity);

        // Create and save the user
        const user = new UserEntity();
        user.username = username;
        user.password = password;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.isVendor = isVendor;
        user.status = DefaultUserStatus;

        const userCreated = await userRepository.save(user);
        return userCreated.toDomainEntity();
    }

}
