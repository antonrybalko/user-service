import { Response } from 'express';
import { Service, Inject } from 'typedi';
import { RequestInterface } from '../../middleware/RequestInterface';
import BaseController from '../shared/BaseController';
import { ManageUsersService } from 'application/usecase/manageUsers/ManageUsersService';
import { CurrentUserDto } from './CurrentUserDto';
import { OrganizationService } from 'application/usecase/organization/OrganizationService';

@Service()
export default class CurrentUserController extends BaseController {
  @Inject()
  private manageUsersService: ManageUsersService;
  @Inject()
  private organizationService: OrganizationService;

  public async getCurrentUser(
    req: RequestInterface,
    res: Response,
  ): Promise<Response> {
    try {
      const { guid } = await this.getTokenPayload(req);
      const user = await this.manageUsersService.getUserByGuid(guid);
      const organizations =
        await this.organizationService.getOrganizationsByAdminGuid(guid);
      return res.json(
        CurrentUserDto.fromUserAndOrganization(user, organizations),
      );
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}
