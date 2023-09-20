import { Logger } from "tslog";
import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { UserService } from '../service/UserService';
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {ConflictException} from "../service/exception/ConflictException";

const router = Router();
const userService = new UserService();

router.get('/', async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User)
        const result = await userRepository.find();
        res.json(result);
    } catch (error) {
        const logger = new Logger();
        logger.error(error);
        res.status(500).json({error: 'Unknown error'});
    }
});

router.post('/register', [
    body('username').notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    body('email').isEmail().withMessage('Enter a valid email address.'),
    body('phoneNumber').isMobilePhone('any').withMessage('Enter a valid phone number.')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        if (error instanceof ConflictException) {
            res.status(409).json({ error: error.message });
        } else {
            const logger = new Logger();
            logger.error(error);
            res.status(500).json({error: 'Unknown error'});
        }
    }
});

export default router;
