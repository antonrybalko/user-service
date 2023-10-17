import { Request, Response } from 'express';
import { Service } from 'typedi';
import { RegisterDto } from './RegisterDto';
import { RegisteredUserDto } from './RegisteredUserDto';
import { RegistrationService } from './RegistrationService';
import BaseController from '@core/api/BaseController';

@Service()
export class RegisterController extends BaseController {
  public constructor(private registerService = new RegistrationService()) {
    super();
  }

  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const registerDto = new RegisterDto(request.body);

      // Validate the request body
      await this.validate(registerDto);
      // Register the user
      const newUser = await this.registerService.registerUser(registerDto);

      return response.status(201).json(new RegisteredUserDto(newUser));
    } catch (error) {
      return this.handleError(response, error);
    }
  }
}
