// src/service/UserService.ts

import { AppDataSource} from "../data-source";
import { User } from '../entity/User';
import bcrypt from 'bcrypt';

export class UserService {

    async createUser(data: any): Promise<User> {
        const userRepository = AppDataSource.getRepository(User)

        // Check for existing user
        const existingUser = await userRepository.findOne({ where: [{ email: data.email }, { phoneNumber: data.phoneNumber }] });
        if (existingUser) {
            throw new Error('User with this email or phone number already exists.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create and save the user
        const user = new User();
        user.username = data.username;
        user.password = hashedPassword;
        user.email = data.email;
        user.phoneNumber = data.phoneNumber;

        return await userRepository.save(user);
    }
}