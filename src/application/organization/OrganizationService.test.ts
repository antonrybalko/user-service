import 'reflect-metadata';
import { Container } from 'typedi';
import { faker } from '@faker-js/faker';
import { generatePhoneNumber } from '@tests/factories/helpers';
import { OrganizationService } from './OrganizationService';
import { OrganizationRepositoryInterface } from './port/OrganizationRepositoryInterface';
import { UserRepositoryInterface } from '../user/port/UserRepositoryInterface';
import { ValidatorInterface } from 'shared/port/ValidatorInterface';
import { SanitizerInterface } from 'shared/port/SanitizerInterface';
import { CreateOrganizationDto } from './dto/CreateOrganizationDto';
import { UpdateOrganizationDto } from './dto/UpdateOrganizationDto';
import { Organization } from 'entity/Organization';
import { OrganizationMember } from 'entity/OrganizationMember';
import { User } from 'entity/User';
import {
  OrganizationRepositoryInterfaceToken,
  UserRepositoryInterfaceToken,
  ValidatorInterfaceToken,
  SanitizerInterfaceToken,
} from 'di/tokens';
import { NotFoundException } from 'shared/exception/NotFoundException';

describe('OrganizationService', () => {
  let organizationService: OrganizationService;
  let organizationRepository: OrganizationRepositoryInterface;
  let userRepository: UserRepositoryInterface;
  let validator: ValidatorInterface;
  let sanitizer: SanitizerInterface;

  beforeAll(() => {
    organizationRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findByGuid: jest.fn(),
      findByAdminGuid: jest.fn(),
      checkIfExists: jest.fn(),
      checkIsAdmin: jest.fn(),
      addMember: jest.fn(),
    } as unknown as OrganizationRepositoryInterface;

    userRepository = {
      findByGuid: jest.fn(),
      findAll: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      checkIfUserExists: jest.fn(),
    } as unknown as UserRepositoryInterface;

    validator = {
      validate: jest.fn(),
    } as unknown as ValidatorInterface;

    sanitizer = {
      sanitize: jest.fn((dto) => dto),
    } as unknown as SanitizerInterface;

    Container.set(OrganizationRepositoryInterfaceToken, organizationRepository);
    Container.set(UserRepositoryInterfaceToken, userRepository);
    Container.set(ValidatorInterfaceToken, validator);
    Container.set(SanitizerInterfaceToken, sanitizer);

    organizationService = Container.get(OrganizationService);
  });

  afterAll(() => {
    Container.reset();
  });

  describe('createOrganization', () => {
    it('should create organization and add creator as admin', async () => {
      const creatorGuid = faker.string.uuid();
      const orgGuid = faker.string.uuid();
      const createDto = new CreateOrganizationDto({
        title: faker.company.name(),
        cityGuid: faker.string.uuid(),
        phone: generatePhoneNumber(),
        email: faker.internet.email(),
        description: faker.company.catchPhrase(),
        registrationNumber: faker.string.alphanumeric(10),
      });

      const user = new User(
        creatorGuid,
        faker.internet.userName(),
        false,
        false,
        faker.person.firstName(),
      );

      const createdOrg = new Organization(
        orgGuid,
        createDto.title,
        createDto.cityGuid,
        createDto.phone,
        createDto.email,
        user,
        [],
        createDto.description,
        createDto.registrationNumber,
      );

      const member = new OrganizationMember(creatorGuid, createdOrg.guid, true);

      (userRepository.findByGuid as jest.Mock).mockResolvedValue(user);
      (organizationRepository.create as jest.Mock).mockResolvedValue(
        createdOrg,
      );
      (organizationRepository.addMember as jest.Mock).mockResolvedValue(member);

      const result = await organizationService.createOrganization(
        creatorGuid,
        createDto,
      );

      expect(result.organizationMembers).toContain(member);
      expect(organizationRepository.create).toHaveBeenCalledWith(
        createDto.title,
        createDto.phone,
        createDto.email,
        createDto.cityGuid,
        creatorGuid,
        createDto.description,
        createDto.registrationNumber,
      );
      expect(organizationRepository.addMember).toHaveBeenCalledWith(
        createdOrg,
        user,
        true,
      );
      expect(validator.validate).toHaveBeenCalledWith(createDto);
      expect(sanitizer.sanitize).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateOrganization', () => {
    it('should update organization when it exists', async () => {
      const orgGuid = faker.string.uuid();
      const updateDto = new UpdateOrganizationDto({
        title: faker.company.name(),
        phone: generatePhoneNumber(),
        email: faker.internet.email(),
        cityGuid: faker.string.uuid(),
        registrationNumber: faker.string.alphanumeric(10),
      });
      const updated = new Organization(
        orgGuid,
        updateDto.title!,
        updateDto.cityGuid!,
        updateDto.phone!,
        updateDto.email!,
        new User(
          faker.string.uuid(),
          faker.internet.userName(),
          false,
          false,
          faker.person.firstName(),
        ),
        [],
        undefined,
        updateDto.registrationNumber,
      );

      (organizationRepository.checkIfExists as jest.Mock).mockResolvedValue(
        true,
      );
      (organizationRepository.update as jest.Mock).mockResolvedValue(updated);

      const result = await organizationService.updateOrganization(
        orgGuid,
        updateDto,
      );

      expect(result).toBe(updated);
      expect(organizationRepository.update).toHaveBeenCalledWith(
        orgGuid,
        updateDto.title,
        updateDto.phone,
        updateDto.email,
        updateDto.cityGuid,
        updateDto.registrationNumber,
      );
      expect(validator.validate).toHaveBeenCalledWith(updateDto);
      expect(sanitizer.sanitize).toHaveBeenCalledWith(updateDto);
    });

    it('should throw NotFoundException when organization does not exist', async () => {
      const updateDto = new UpdateOrganizationDto({ title: 't' });
      (organizationRepository.checkIfExists as jest.Mock).mockResolvedValue(
        false,
      );

      await expect(
        organizationService.updateOrganization('missing', updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUserOrganization', () => {
    it('should update organization when user is admin', async () => {
      const orgGuid = faker.string.uuid();
      const userGuid = faker.string.uuid();
      const updateDto = new UpdateOrganizationDto({
        title: faker.company.name(),
        description: faker.company.catchPhrase(),
        published: true,
      });
      const updated = new Organization(
        orgGuid,
        updateDto.title!,
        faker.string.uuid(),
        generatePhoneNumber(),
        faker.internet.email(),
        new User(
          faker.string.uuid(),
          faker.internet.userName(),
          false,
          false,
          faker.person.firstName(),
        ),
        [],
        updateDto.description,
        undefined,
        updateDto.published,
      );
      (organizationRepository.checkIsAdmin as jest.Mock).mockResolvedValue(
        true,
      );
      (organizationRepository.update as jest.Mock).mockResolvedValue(updated);

      const result = await organizationService.updateUserOrganization(
        userGuid,
        orgGuid,
        updateDto,
      );

      expect(result).toBe(updated);
      expect(organizationRepository.update).toHaveBeenCalledWith(
        orgGuid,
        updateDto.title,
        updateDto.phone,
        updateDto.email,
        updateDto.cityGuid,
        updateDto.description,
        updateDto.registrationNumber,
        updateDto.published,
      );
    });

    it('should throw NotFoundException when user is not admin', async () => {
      (organizationRepository.checkIsAdmin as jest.Mock).mockResolvedValue(
        false,
      );
      const updateDto = new UpdateOrganizationDto({
        title: faker.company.name(),
      });

      await expect(
        organizationService.updateUserOrganization('u', 'o', updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  it('getOrganizationsByAdminGuid should return organizations', async () => {
    const adminGuid = faker.string.uuid();
    const orgs = [
      new Organization(
        faker.string.uuid(),
        faker.company.name(),
        faker.string.uuid(),
        generatePhoneNumber(),
        faker.internet.email(),
        new User(
          adminGuid,
          faker.internet.userName(),
          false,
          false,
          faker.person.firstName(),
        ),
        [],
      ),
    ];
    (organizationRepository.findByAdminGuid as jest.Mock).mockResolvedValue(
      orgs,
    );

    await expect(
      organizationService.getOrganizationsByAdminGuid(adminGuid),
    ).resolves.toBe(orgs);
  });
});
