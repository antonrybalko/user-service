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
import { UserService } from 'application/usecase/user/UserService';
import { UserRepository } from 'infrastructure/persistence/repository/UserRepository';
import { OrganizationRepository } from 'infrastructure/persistence/repository/OrganizationRepository';
import { OrganizationService } from 'application/usecase/organization/OrganizationService';
import { StorageService } from 'infrastructure/cloud/StorageService';
import {
  PasswordServiceInterfaceToken,
  TokenServiceInterfaceToken,
  LoggerInterfaceToken as LoggerServiceToken,
  ValidatorInterfaceToken as ValidatorServiceToken,
  SanitizerInterfaceToken as SanitizerServiceToken,
  LoginRepositoryInterfaceToken,
  RegistrationRepositoryInterfaceToken,
  UserRepositoryInterfaceToken,
  OrganizationRepositoryInterfaceToken,
} from 'di/tokens';

Container.set(PasswordServiceInterfaceToken, Container.get(PasswordService));
Container.set(TokenServiceInterfaceToken, Container.get(TokenService));
Container.set(LoggerServiceToken, Container.get(LoggerService));
Container.set(ValidatorServiceToken, Container.get(ValidatorService));
Container.set(SanitizerServiceToken, Container.get(SanitizerService));

Container.set(LoginRepositoryInterfaceToken, Container.get(LoginRepository));
Container.set('LoginService', Container.get(LoginService));

Container.set(StorageService, Container.get(StorageService));

Container.set(RegistrationRepositoryInterfaceToken, Container.get(RegistrationRepository));
Container.set('RegistrationService', Container.get(RegistrationService));

Container.set(UserRepositoryInterfaceToken, Container.get(UserRepository));
Container.set('UserService', Container.get(UserService));

Container.set(OrganizationRepositoryInterfaceToken, Container.get(OrganizationRepository));
Container.set('OrganizationService', Container.get(OrganizationService));
