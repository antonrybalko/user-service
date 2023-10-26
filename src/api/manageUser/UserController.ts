import { Logger } from 'tslog';
import { Router, Request, Response } from 'express';
import { UserService } from '../../service/UserService';
import { AppDataSource } from '../../persistence/data-source';
import { UserEntity } from '../../persistence/entity/UserEntity';
import { NotFoundException } from '../../service/exception/NotFoundException';
import { AuthenticateMiddleware } from '../middleware/AuthenticateMiddleware';
import { EnsureAdminUser } from '../middleware/EnsureAdminUser';
import Container from 'typedi';

const router = Router();

const authenticateMiddleware = Container.get(AuthenticateMiddleware);
const ensureAdminUser = Container.get(EnsureAdminUser);

router.get(
  '/',
  (req, res, next) => authenticateMiddleware.authenticate(req, res, next),
  (req, res, next) => ensureAdminUser.ensure(req, res, next),
  async (req, res) => {
    try {
      const userRepository = AppDataSource.getRepository(UserEntity);
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
