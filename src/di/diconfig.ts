import { Container } from 'typedi';
import { LoggerService } from 'adapter/observability/LoggerService';
import { ValidatorService } from 'adapter/validation/ValidatorService';
import { SanitizerService } from 'adapter/validation/SanitizerService';
import { RegistrationRepository } from 'adapter/persistence/repository/RegistrationRepository';
import { RegistrationService } from 'application/register/RegistrationService';
import { PasswordService } from 'adapter/security/PasswordService';
import { TokenService } from 'adapter/security/TokenService';
import { LoginRepository } from 'adapter/persistence/repository/LoginRepository';
import { RefreshTokenRepository } from 'adapter/persistence/repository/RefreshTokenRepository';
import { LoginService } from 'application/login/LoginService';
import { TokenRotationService } from 'application/tokenRotation/TokenRotationService';
import { UserService } from 'application/user/UserService';
import { UserRepository } from 'adapter/persistence/repository/UserRepository';
import { OrganizationRepository } from 'adapter/persistence/repository/OrganizationRepository';
import { OrganizationService } from 'application/organization/OrganizationService';
import { StorageService } from 'adapter/cloud/StorageService';
import {
  PasswordServiceInterfaceToken,
  TokenServiceInterfaceToken,
  LoggerInterfaceToken as LoggerServiceToken,
  ValidatorInterfaceToken as ValidatorServiceToken,
  SanitizerInterfaceToken as SanitizerServiceToken,
  LoginRepositoryInterfaceToken,
  RefreshTokenRepositoryInterfaceToken,
  RegistrationRepositoryInterfaceToken,
  UserRepositoryInterfaceToken,
  OrganizationRepositoryInterfaceToken,
  CloudStorageInterfaceToken,
} from 'di/tokens';

// Register infrastructure services first
Container.set(PasswordServiceInterfaceToken, Container.get(PasswordService));
Container.set(TokenServiceInterfaceToken, Container.get(TokenService));
Container.set(LoggerServiceToken, Container.get(LoggerService));
Container.set(ValidatorServiceToken, Container.get(ValidatorService));
Container.set(SanitizerServiceToken, Container.get(SanitizerService));
Container.set(CloudStorageInterfaceToken, Container.get(StorageService));
Container.set(StorageService, Container.get(StorageService));

// Register repositories with their interface tokens
Container.set(LoginRepositoryInterfaceToken, Container.get(LoginRepository));
Container.set(
  RefreshTokenRepositoryInterfaceToken,
  Container.get(RefreshTokenRepository),
);
Container.set(
  RegistrationRepositoryInterfaceToken,
  Container.get(RegistrationRepository),
);
Container.set(UserRepositoryInterfaceToken, Container.get(UserRepository));
Container.set(
  OrganizationRepositoryInterfaceToken,
  Container.get(OrganizationRepository),
);

// Register application services after their dependencies
Container.set('LoginService', Container.get(LoginService));
Container.set('TokenRotationService', Container.get(TokenRotationService));
Container.set('RegistrationService', Container.get(RegistrationService));
Container.set('UserService', Container.get(UserService));
Container.set('OrganizationService', Container.get(OrganizationService));
