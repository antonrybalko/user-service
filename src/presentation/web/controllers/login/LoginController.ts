import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { LoginService } from 'application/login/LoginService';
import { LoginDto } from 'application/login/dto/LoginDto';
import BaseController from 'presentation/web/controllers/shared/BaseController';
import TokenDto from './TokenDto';

@Service()
class LoginController extends BaseController {
  @Inject()
  private loginService: LoginService;

  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const loginDto = new LoginDto(request.body);

      // Validate the request body
      // await this.validate(loginDto);
      const token = await this.loginService.login(loginDto);

      return response.status(200).json(new TokenDto(token));
    } catch (error) {
      return this.handleError(response, error);
    }
  }
}

export default LoginController;
