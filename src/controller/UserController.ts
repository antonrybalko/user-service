import { Logger } from 'tslog';
import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { UserService } from '../service/UserService';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { NotFoundException } from '../service/exception/NotFoundException';
import { AuthService } from '../service/AuthService';
import { AuthenticateMiddleware } from '../middleware/AuthenticateMiddleware';
import { EnsureAdminUser } from '../middleware/EnsureAdminUser';
import Container from 'typedi';

const router = Router();

const authenticateMiddleware = Container.get(AuthenticateMiddleware);
const ensureAdminUser = Container.get(EnsureAdminUser);

router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userService = new UserService();
      const authService = new AuthService();

      const user = await userService.findByUsername(req.body.username);
      if (!user.isActive()) {
        return res.status(401).json({
          error: 'Username is not active',
        });
      }

      const isPasswordValid = await authService.comparePasswords(
        req.body.password,
        user.password,
      );

      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid username or password',
        });
      }

      const token = authService.createToken(user);
      res.json({ token });
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(409).json({ error: 'Invalid username or password' });
      } else {
        const logger = new Logger();
        logger.error(error);
        res.status(500).json({ error: 'Unknown error' });
      }
    }
  },
);

router.get(
  '/',
  (req, res, next) => authenticateMiddleware.authenticate(req, res, next),
  (req, res, next) => ensureAdminUser.ensure(req, res, next),
  async (req, res) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const result = await userRepository.find();
      res.json(result);
    } catch (error) {
      const logger = new Logger();
      logger.error(error);
      res.status(500).json({ error: 'Unknown error' });
    }
  },
);

router.get(
  '/:guid',
  (req, res, next) => authenticateMiddleware.authenticate(req, res, next),
  (req, res, next) => ensureAdminUser.ensure(req, res, next),
  async (req: Request, res: Response) => {
    const { guid } = req.params;

    try {
      const userService = new UserService();
      const { username, email, phoneNumber, isAdmin, isVendor, status } =
        await userService.findByGuid(guid);

      res.json({
        guid,
        username,
        email,
        phoneNumber,
        isAdmin,
        isVendor,
        status,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({ error: error.message });
      }
      const logger = new Logger();
      logger.error(error);
      res.status(500).json({ error: 'Unknown error' });
    }
  },
);

export default router;
