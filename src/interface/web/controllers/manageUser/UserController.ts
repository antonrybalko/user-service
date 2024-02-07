import { Request, Response } from 'express';
import { Service, Inject } from 'typedi';
import { ManageUsersService } from 'application/usecase/manageUsers/ManageUsersService';
import BaseController from 'interface/web/controllers/shared/BaseController';

@Service()
class UserController extends BaseController {
  @Inject('ManageUsersService')
  private manageUsersService: ManageUsersService;

  public async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.manageUsersService.getAllUsers();
      return res.json(users);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  public async getUserByGuid(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.manageUsersService.getUserByGuid(req.params.guid);
      return res.json(user);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  public async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const guid = req.params.guid;
      const userData = req.body;
      const updatedUser = await this.manageUsersService.updateUser(
        guid,
        userData,
      );
      return res.json(updatedUser);
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}

export default UserController;
