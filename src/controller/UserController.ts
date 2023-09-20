import { Logger } from "tslog";
import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { UserService } from '../service/UserService';
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {ConflictException} from "../registration/exception/ConflictException";
import {NotFoundException} from "../service/exception/NotFoundException";
import {AuthService} from "../service/AuthService";
import {authenticateJWT} from "../middlewares/authenticateJWT";
import {ensureAdminUser} from "../middlewares/ensureAdminUser";
import {RequestInterface} from "../middlewares/RequestInterface";

const router = Router();

router.post('/login', [
    body('username').notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().withMessage('Password is required.')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userService = new UserService();
        const authService = new AuthService();

        const user = await userService.findByUsername(req.body.username);
        const isPasswordValid = await authService.comparePasswords(req.body.password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = authService.createToken(user);
        res.json({ token });
    } catch (error) {
        if (error instanceof NotFoundException) {
            res.status(409).json({ error: 'Invalid username or password' });
        } else {
            const logger = new Logger();
            logger.error(error);
            res.status(500).json({error: 'Unknown error'});
        }
    }
});

router.get('/', authenticateJWT, ensureAdminUser, async (req, res) => {
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

router.get('/:guid', authenticateJWT, ensureAdminUser, async (req: Request, res: Response) => {
    const { guid } = req.params;

    try {
        const userService = new UserService();
        const {username, email, phoneNumber, isAdmin, isVendor, status} = await userService.findByGuid(guid);

        res.json({guid, username, email, phoneNumber, isAdmin, isVendor, status});
    } catch (error) {
        if (error instanceof NotFoundException) {
            res.status(404).json({ error: error.message });
        }
        const logger = new Logger();
        logger.error(error);
        res.status(500).json({ error: 'Unknown error' });
    }
});


export default router;
