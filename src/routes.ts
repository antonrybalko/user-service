import { Router } from 'express';
import { Request, Response } from 'express';
import registerController from './register';
import { body, validationResult } from 'express-validator';
import { UserService } from './service/UserService';
import { AuthService } from './service/AuthService';
import { NotFoundException } from './service/exception/NotFoundException';
import { Logger } from 'tslog';
import userRouter from './controller/UserController';

const router = Router();

router.get('/', (request: Request, response: Response) => {
  return response.json({ status: 'OK' });
});

router.post('/register', (request: Request, response: Response) => {
  return registerController.handle(request, response);
});

router.use('/users', userRouter);

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

export { router };
