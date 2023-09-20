import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User} from "../entity/User";

export class AuthService {
    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    createToken(user: User): string {
        const payload = {
            guid: user.guid,
            username: user.username,
        };
        return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    }
}