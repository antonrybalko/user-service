import { Response } from 'express';
import { Service, Inject } from 'typedi';
import { RequestInterface } from '../../middleware/RequestInterface';
import BaseController from '../shared/BaseController';
import { UserService } from 'application/usecase/user/UserService';
import { CurrentUserDto } from './CurrentUserDto';
import { OrganizationService } from 'application/usecase/organization/OrganizationService';
import { UserImageService } from 'application/usecase/user/UserImageService';

@Service()
export default class CurrentUserController extends BaseController {
  @Inject()
  private manageUsersService: UserService;
  @Inject()
  private organizationService: OrganizationService;
  @Inject()
  private userImageService: UserImageService;

  public async getCurrentUser(
    req: RequestInterface,
    res: Response,
  ): Promise<Response> {
    try {
      const { guid } = await this.getTokenPayload(req);
      const user = await this.manageUsersService.getUserByGuid(guid);
      const organizations =
        await this.organizationService.getOrganizationsByAdminGuid(guid);
      const userImage = await this.userImageService.getUserImage(guid);
      return res.json(
        CurrentUserDto.fromUserAndOrganizationsAndImages(
          user,
          organizations,
          userImage,
        ),
      );
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}
