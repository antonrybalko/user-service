import { Container } from 'typedi';
import { LoggerService } from './shared/service/LoggerService';
import { ValidatorService } from './shared/service/ValidatorService';
import { SanitizerService } from './shared/service/SanitizerService';
import { RegistrationRepository } from './persistence/repository/RegistrationRepository';
import { RegistrationService } from './application/register/RegistrationService';
import { PasswordService } from 'security/PasswordService';
import { TokenService } from 'security/TokenService';
import { LoginRepository } from 'persistence/repository/LoginRepository';
import { LoginService } from 'application/login/LoginService';

Container.set('PasswordServiceInterface', Container.get(PasswordService));
Container.set('TokenServiceInterface', Container.get(TokenService));
Container.set('LoggerInterface', Container.get(LoggerService));
Container.set('ValidatorInterface', Container.get(ValidatorService));
Container.set('SanitizerInterface', Container.get(SanitizerService));

Container.set('LoginRepositoryInterface', Container.get(LoginRepository));
Container.set('LoginService', Container.get(LoginService));

Container.set(
  'RegistrationRepositoryInterface',
  Container.get(RegistrationRepository),
);
Container.set('RegistrationService', Container.get(RegistrationService));
