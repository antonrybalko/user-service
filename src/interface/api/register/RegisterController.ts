import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { RegistrationService } from '../../../application/usecase/register/RegistrationService';
import { RegisterDto } from '../../../application/usecase/register/RegisterDto';
import { RegisteredUserDto } from './RegisteredUserDto';
import BaseController from '../shared/BaseController';

@Service()
export default class RegisterController extends BaseController {
  @Inject('RegistrationService')
  private registerService: RegistrationService;

  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const registerDto = new RegisterDto(request.body);

      // Register the user
      const user = await this.registerService.registerUser(registerDto);

      return response
        .status(201)
        .json(RegisteredUserDto.fromDomainEntity(user));
    } catch (error) {
      return this.handleError(response, error);
    }
  }
}
