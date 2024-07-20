import { Container } from 'typedi';
import { LoggerService } from 'shared/service/LoggerService';
import { ValidatorService } from 'shared/service/ValidatorService';
import { SanitizerService } from 'shared/service/SanitizerService';
import { RegistrationRepository } from 'infrastructure/persistence/repository/RegistrationRepository';
import { RegistrationService } from 'application/usecase/register/RegistrationService';
import { PasswordService } from 'infrastructure/security/PasswordService';
import { TokenService } from 'infrastructure/security/TokenService';
import { LoginRepository } from 'infrastructure/persistence/repository/LoginRepository';
import { LoginService } from 'application/usecase/login/LoginService';
import { ManageUsersService } from 'application/usecase/manageUsers/ManageUsersService';
import { ManageUsersRepository } from 'infrastructure/persistence/repository/ManageUsersRepository';
import { OrganizationRepository } from 'infrastructure/persistence/repository/OrganizationRepository';
import { OrganizationService } from 'application/usecase/organization/OrganizationService';
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
  'ManageUsersRepositoryInterface',
  Container.get(ManageUsersRepository),
);
Container.set('ManageUsersService', Container.get(ManageUsersService));

Container.set(
  'OrganizationRepositoryInterface',
  Container.get(OrganizationRepository),
);
Container.set('OrganizationService', Container.get(OrganizationService));
