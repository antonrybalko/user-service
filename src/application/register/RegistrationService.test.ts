import 'reflect-metadata';
import { Container } from 'typedi';
import { faker } from '@faker-js/faker';
import { RegistrationService } from './RegistrationService';
import { RegistrationRepositoryInterface } from './port/RegistrationRepositoryInterface';
import { PasswordServiceInterface } from 'application/shared/port/PasswordServiceInterface';
import { ValidatorInterface } from 'shared/port/ValidatorInterface';
import { SanitizerInterface } from 'shared/port/SanitizerInterface';
import { RegisterDto } from './dto/RegisterDto';
import { ConflictException } from 'shared/exception/ConflictException';
import { User } from 'entity/User';
import {
  RegistrationRepositoryInterfaceToken,
  PasswordServiceInterfaceToken,
  ValidatorInterfaceToken,
  SanitizerInterfaceToken,
} from 'di/tokens';

describe('RegistrationService', () => {
  let registrationService: RegistrationService;
  let registrationRepository: jest.Mocked<RegistrationRepositoryInterface>;
  let passwordService: jest.Mocked<PasswordServiceInterface>;
  let validator: jest.Mocked<ValidatorInterface>;
  let sanitizer: jest.Mocked<SanitizerInterface>;

  const createRegisterDto = (
    overrides: Partial<RegisterDto> = {},
  ): RegisterDto =>
    new RegisterDto({
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      phone: faker.phone.number('##########'),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      isVendor: faker.datatype.boolean(),
      ...overrides,
    });

  const createUserFromDto = (dto: RegisterDto): User =>
    new User(
      faker.string.uuid(),
      dto.username,
      false,
      dto.isVendor ?? false,
      dto.firstname,
      dto.lastname,
      dto.phone,
      dto.email,
    );

  beforeEach(() => {
    registrationRepository = {
      checkIfUserExists: jest.fn(),
      checkIfEmailOrPhoneExists: jest.fn(),
      createUser: jest.fn(),
    } as jest.Mocked<RegistrationRepositoryInterface>;

    passwordService = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    } as jest.Mocked<PasswordServiceInterface>;

    validator = {
      validate: jest.fn(),
      isValidationError: jest.fn(),
      validationErrorToMessage: jest.fn(),
    } as jest.Mocked<ValidatorInterface>;

    sanitizer = {
      sanitize: jest.fn((dto) => dto),
    } as jest.Mocked<SanitizerInterface>;

    Container.set(RegistrationRepositoryInterfaceToken, registrationRepository);
    Container.set(PasswordServiceInterfaceToken, passwordService);
    Container.set(ValidatorInterfaceToken, validator);
    Container.set(SanitizerInterfaceToken, sanitizer);

    registrationService = Container.get(RegistrationService);
  });

  afterEach(() => {
    Container.reset();
    jest.clearAllMocks();
  });

  it('should register a new user with hashed password', async () => {
    const dto = createRegisterDto();
    const hashedPassword = faker.internet.password();
    const expectedUser = createUserFromDto(dto);

    registrationRepository.checkIfUserExists.mockResolvedValue(false);
    registrationRepository.checkIfEmailOrPhoneExists.mockResolvedValue(false);
    passwordService.hashPassword.mockResolvedValue(hashedPassword);
    registrationRepository.createUser.mockResolvedValue(expectedUser);

    const result = await registrationService.registerUser(dto);

    expect(result).toBe(expectedUser);
    expect(validator.validate).toHaveBeenCalledWith(dto);
    expect(sanitizer.sanitize).toHaveBeenCalledWith(dto);
    expect(passwordService.hashPassword).toHaveBeenCalledWith(dto.password);
    expect(registrationRepository.createUser).toHaveBeenCalledWith(
      dto.username,
      hashedPassword,
      dto.firstname,
      dto.lastname,
      dto.email,
      dto.phone,
      dto.isVendor,
    );
  });

  it('should throw ConflictException if username already exists', async () => {
    const dto = createRegisterDto();

    registrationRepository.checkIfUserExists.mockResolvedValue(true);

    await expect(registrationService.registerUser(dto)).rejects.toThrow(
      new ConflictException('User with this username already exists'),
    );

    expect(
      registrationRepository.checkIfEmailOrPhoneExists,
    ).not.toHaveBeenCalled();
    expect(registrationRepository.createUser).not.toHaveBeenCalled();
  });

  it('should throw ConflictException if email or phone already exists', async () => {
    const dto = createRegisterDto();

    registrationRepository.checkIfUserExists.mockResolvedValue(false);
    registrationRepository.checkIfEmailOrPhoneExists.mockResolvedValue(true);

    await expect(registrationService.registerUser(dto)).rejects.toThrow(
      new ConflictException(
        'User with this email or phone number already exists.',
      ),
    );

    expect(registrationRepository.createUser).not.toHaveBeenCalled();
  });

  it('should propagate errors from password hashing', async () => {
    const dto = createRegisterDto();
    const hashError = new Error('hash fail');

    registrationRepository.checkIfUserExists.mockResolvedValue(false);
    registrationRepository.checkIfEmailOrPhoneExists.mockResolvedValue(false);
    passwordService.hashPassword.mockRejectedValue(hashError);

    await expect(registrationService.registerUser(dto)).rejects.toThrow(
      hashError,
    );
  });

  it('should propagate errors from repository.createUser', async () => {
    const dto = createRegisterDto();
    const hashedPassword = faker.internet.password();
    const dbError = new Error('db error');

    registrationRepository.checkIfUserExists.mockResolvedValue(false);
    registrationRepository.checkIfEmailOrPhoneExists.mockResolvedValue(false);
    passwordService.hashPassword.mockResolvedValue(hashedPassword);
    registrationRepository.createUser.mockRejectedValue(dbError);

    await expect(registrationService.registerUser(dto)).rejects.toThrow(
      dbError,
    );
  });
});
