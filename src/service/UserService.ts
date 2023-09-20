// src/service/UserService.ts

import { AppDataSource} from "../data-source";
import { User } from '../entity/User';
import {NotFoundException} from "./exception/NotFoundException";

export class UserService {

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