import { Response } from 'express';
import { Service, Inject } from 'typedi';
import { RequestInterface } from '../../middleware/RequestInterface';
import BaseController from '../shared/BaseController';
import { ManageUsersService } from 'application/usecase/manageUsers/ManageUsersService';
import { UnauthorizedException } from 'shared/exception/UnauthorizedException';
import { CurrentUserDto } from './CurrentUserDto';

@Service()
export default class CurrentUserController extends BaseController {
  @Inject('ManageUsersService')
  private manageUsersService: ManageUsersService;

  public async getCurrentUser(
    req: RequestInterface,
    res: Response,
  ): Promise<Response> {
    try {
      if (!req.tokenPayload) {
        return this.handleError(
          res,
          new UnauthorizedException('No token payload found.'),
        );
      }
      const userGuid = req.tokenPayload.guid;
      const user = await this.manageUsersService.getUserByGuid(userGuid);
      // const { guid, username, isAdmin, isVendor } = user;
      return res.json(CurrentUserDto.fromUser(user));
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}
