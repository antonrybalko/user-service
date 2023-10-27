import { Inject, Service } from 'typedi';
import { NextFunction, Response } from 'express';
import { UserService } from '../../../service/UserService';
import { RequestInterface } from './RequestInterface';
import { LoggerInterface } from '../../../shared/interface/LoggerInterface';

@Service()
export class EnsureAdminUser {
  @Inject('LoggerInterface')
  private logger: LoggerInterface;

  async ensure(req: RequestInterface, res: Response, next: NextFunction) {
    try {
      if (req.tokenPayload === undefined) {
        next();
        return;
      }
      const userGuid = req.tokenPayload.guid;
      const userService = new UserService();
      const user = await userService.findByGuid(userGuid);

      if (user && user.isActive() && user.isAdmin) {
        next();
        return;
      }

      this.logger.error(`EnsureAdminUser failed for: ${userGuid}`);
      res.sendStatus(403);
    } catch (error) {
      this.logger.error(error);
      res.status(500).json({ error: 'Unknown error' });
    }
  }
}
