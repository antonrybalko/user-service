import { Response } from 'express';
import { Service, Inject } from 'typedi';
import { RequestInterface } from '../../middleware/RequestInterface';
import BaseController from '../shared/BaseController';
import { ManageUsersService } from 'application/usecase/manageUsers/ManageUsersService';
import { CurrentUserDto } from './CurrentUserDto';

@Service()
export default class CurrentUserController extends BaseController {
  @Inject()
  private manageUsersService: ManageUsersService;

  public async getCurrentUser(
    req: RequestInterface,
    res: Response,
  ): Promise<Response> {
    try {
      const { guid } = await this.getTokenPayload(req);
      const user = await this.manageUsersService.getUserByGuid(guid);
      // const { guid, username, isAdmin, isVendor } = user;
      return res.json(CurrentUserDto.fromUser(user));
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}
