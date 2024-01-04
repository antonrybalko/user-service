import { Request, Response } from 'express';
import Container, { Service } from 'typedi';
import { RegisterDto } from './RegisterDto';
import { RegisteredUserDto } from './RegisteredUserDto';
import BaseController from '../shared/BaseController';
import { RegistrationService } from '../../register/RegistrationService';

@Service()
export class RegisterController extends BaseController {
  private registerService: RegistrationService;

  public constructor() {
    super();
    this.registerService = Container.get(RegistrationService);
  }

  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const registerDto = new RegisterDto(request.body);

      // Validate the request body
      await this.validate(registerDto);
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
