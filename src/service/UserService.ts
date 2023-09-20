// src/service/UserService.ts

import { AppDataSource} from "../data-source";
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import { ConflictException } from "./exception/ConflictException";
import { AuthService } from './AuthService';
import {NotFoundException} from "./exception/NotFoundException";

export class UserService {

    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async createUser(data: any): Promise<User> {
        const userRepository = AppDataSource.getRepository(User)

        // Check for existing user
        const existingUser = await userRepository.findOne({ where: [{ email: data.email }, { phoneNumber: data.phoneNumber }] });
        if (existingUser) {
            throw new ConflictException('User with this email or phone number already exists.');
        }

        // Hash the password
        const hashedPassword = await this.authService.hashPassword(data.password);

        // Create and save the user
        const user = new User();
        user.username = data.username;
        user.password = hashedPassword;
        user.email = data.email;
        user.phoneNumber = data.phoneNumber;

        return await userRepository.save(user);
    }

    async findByUsername(username: string): Promise<User> {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: {username}});

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async findByGuid(guid: string): Promise<User> {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: {guid}});

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}