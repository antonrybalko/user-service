import { Inject, Service } from 'typedi';
import { NextFunction, Response } from 'express';
import { RequestInterface } from './RequestInterface';
import { LoggerInterface } from 'shared/port/LoggerInterface';
import { UserService } from 'application/user/UserService';
import { LoggerInterfaceToken } from 'di/tokens';

@Service()
export class EnsureAdminUser {
  @Inject()
  private manageUsersService: UserService;

  @Inject(LoggerInterfaceToken)
  private logger!: LoggerInterface;

  async ensure(req: RequestInterface, res: Response, next: NextFunction) {
    try {
      if (req.tokenPayload === undefined) {
        next();
        return;
      }
      const userGuid = req.tokenPayload.guid;

      if (await this.manageUsersService.isUserAdmin(userGuid)) {
        next();
        return;
      }

      this.logger.error(`EnsureAdminUser failed for: ${userGuid}`);
      res.status(403).json({ error: 'Forbidden' });
    } catch (error) {
      this.logger.error(error);
      res.status(500).json({ error: 'Unknown error' });
    }
  }
}
