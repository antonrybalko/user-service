import { Token } from 'typedi';
import { UserRepositoryInterface } from 'application/user/port/UserRepositoryInterface';
import { OrganizationRepositoryInterface } from 'application/organization/port/OrganizationRepositoryInterface';
import { RegistrationRepositoryInterface } from 'application/register/port/RegistrationRepositoryInterface';
import { LoginRepositoryInterface } from 'application/login/port/LoginRepositoryInterface';
import { PasswordServiceInterface } from 'application/shared/port/PasswordServiceInterface';
import { TokenServiceInterface } from 'application/shared/port/TokenServiceInterface';
import { LoggerInterface } from 'shared/port/LoggerInterface';
import { ValidatorInterface } from 'shared/port/ValidatorInterface';
import { SanitizerInterface } from 'shared/port/SanitizerInterface';

// Repository Tokens
export const UserRepositoryInterfaceToken = new Token<UserRepositoryInterface>('UserRepositoryInterface');
export const OrganizationRepositoryInterfaceToken = new Token<OrganizationRepositoryInterface>('OrganizationRepositoryInterface');
export const RegistrationRepositoryInterfaceToken = new Token<RegistrationRepositoryInterface>('RegistrationRepositoryInterface');
export const LoginRepositoryInterfaceToken = new Token<LoginRepositoryInterface>('LoginRepositoryInterface');

// Service Tokens
export const PasswordServiceInterfaceToken = new Token<PasswordServiceInterface>('PasswordServiceInterface');
export const TokenServiceInterfaceToken = new Token<TokenServiceInterface>('TokenServiceInterface');
export const CloudStorageInterfaceToken = new Token<string>('CloudStorageInterface');

// Shared Service Tokens
export const LoggerInterfaceToken = new Token<LoggerInterface>('LoggerInterface');
export const ValidatorInterfaceToken = new Token<ValidatorInterface>('ValidatorInterface');
export const SanitizerInterfaceToken = new Token<SanitizerInterface>('SanitizerInterface');
