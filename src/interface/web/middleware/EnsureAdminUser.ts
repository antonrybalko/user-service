import { Inject, Service } from 'typedi';
import { NextFunction, Response } from 'express';
import { RequestInterface } from './RequestInterface';
import { LoggerInterface } from 'shared/interface/LoggerInterface';
import { ManageUsersService } from 'application/usecase/manageUsers/ManageUsersService';

@Service()
export class EnsureAdminUser {
  @Inject('ManageUsersService')
  private manageUsersService: ManageUsersService;

  @Inject('LoggerInterface')
  private logger: LoggerInterface;

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
