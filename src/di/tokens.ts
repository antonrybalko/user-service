import { Token } from 'typedi';
import { UserRepositoryInterface } from 'application/usecase/user/UserRepositoryInterface';
import { OrganizationRepositoryInterface } from 'application/usecase/organization/OrganizationRepositoryInterface';
import { RegistrationRepositoryInterface } from 'application/usecase/register/RegistrationRepositoryInterface';
import { LoginRepositoryInterface } from 'application/usecase/login/LoginRepositoryInterface';
import { PasswordServiceInterface } from 'application/services/PasswordServiceInterface';
import { TokenServiceInterface } from 'application/services/TokenServiceInterface';
import { LoggerInterface } from 'shared/interface/LoggerInterface';
import { ValidatorInterface } from 'shared/interface/ValidatorInterface';
import { SanitizerInterface } from 'shared/interface/SanitizerInterface';

// Repository Tokens
export const UserRepositoryInterfaceToken = new Token<UserRepositoryInterface>('UserRepositoryInterface');
export const OrganizationRepositoryInterfaceToken = new Token<OrganizationRepositoryInterface>('OrganizationRepositoryInterface');
export const RegistrationRepositoryInterfaceToken = new Token<RegistrationRepositoryInterface>('RegistrationRepositoryInterface');
export const LoginRepositoryInterfaceToken = new Token<LoginRepositoryInterface>('LoginRepositoryInterface');

// Service Tokens
export const PasswordServiceInterfaceToken = new Token<PasswordServiceInterface>('PasswordServiceInterface');
export const TokenServiceInterfaceToken = new Token<TokenServiceInterface>('TokenServiceInterface');

// Shared Service Tokens
export const LoggerInterfaceToken = new Token<LoggerInterface>('LoggerInterface');
export const ValidatorInterfaceToken = new Token<ValidatorInterface>('ValidatorInterface');
export const SanitizerInterfaceToken = new Token<SanitizerInterface>('SanitizerInterface');
