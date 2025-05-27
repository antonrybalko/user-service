import { Container } from 'typedi';
import { LoggerService } from 'shared/service/LoggerService';
import { ValidatorService } from 'shared/service/ValidatorService';
import { SanitizerService } from 'shared/service/SanitizerService';
import { RegistrationRepository } from 'modules/auth/infrastructure/RegistrationRepository';
import { RegistrationService } from 'modules/auth/application/register_usecases/RegistrationService';
import { PasswordService } from 'modules/auth/infrastructure/PasswordService';
import { TokenService } from 'modules/auth/infrastructure/TokenService';
import { LoginRepository } from 'modules/auth/infrastructure/LoginRepository';
import { LoginService } from 'modules/auth/application/login_usecases/LoginService';
import { UserService } from 'modules/user/application/user_usecases/UserService';
import { UserRepository } from 'modules/user/infrastructure/UserRepository';
import { OrganizationRepository } from 'modules/organization/infrastructure/OrganizationRepository';
import { OrganizationService } from 'modules/organization/application/organization_usecases/OrganizationService';
import { StorageService } from 'infrastructure/cloud/StorageService';

Container.set('PasswordServiceInterface', Container.get(PasswordService));
Container.set('TokenServiceInterface', Container.get(TokenService));
Container.set('LoggerInterface', Container.get(LoggerService));
Container.set('ValidatorInterface', Container.get(ValidatorService));
Container.set('SanitizerInterface', Container.get(SanitizerService));

Container.set('LoginRepositoryInterface', Container.get(LoginRepository));
Container.set('LoginService', Container.get(LoginService));

Container.set(StorageService, new StorageService());

Container.set(
  'RegistrationRepositoryInterface',
  Container.get(RegistrationRepository),
);
Container.set('RegistrationService', Container.get(RegistrationService));

Container.set(
  'UserRepositoryInterface',
  Container.get(UserRepository),
);
Container.set('UserService', Container.get(UserService));

Container.set(
  'OrganizationRepositoryInterface',
  Container.get(OrganizationRepository),
);
Container.set('OrganizationService', Container.get(OrganizationService));
