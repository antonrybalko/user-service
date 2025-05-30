import { Service, Inject } from 'typedi';
import { Organization } from 'entity/Organization';
import BaseUseCaseService from 'application/shared/BaseUseCaseService';
import { OrganizationRepositoryInterface } from './port/OrganizationRepositoryInterface';
import { CreateOrganizationDto } from './dto/CreateOrganizationDto';
import { UpdateOrganizationDto } from './dto/UpdateOrganizationDto';
import { NotFoundException } from 'shared/exception/NotFoundException';
import { UserRepositoryInterface } from '../user/port/UserRepositoryInterface';
import {
  UserRepositoryInterfaceToken,
  OrganizationRepositoryInterfaceToken,
} from 'di/tokens';

@Service()
export class OrganizationService extends BaseUseCaseService {
  @Inject(UserRepositoryInterfaceToken)
  private userRepository!: UserRepositoryInterface;

  @Inject(OrganizationRepositoryInterfaceToken)
  private organizationRepository!: OrganizationRepositoryInterface;

  async createOrganization(
    creatorUserGuid: string,
    organizationData: CreateOrganizationDto,
  ): Promise<Organization> {
    await this.validate(organizationData);

    const creatorUser = await this.userRepository.findByGuid(creatorUserGuid);

    const { title, phone, email, cityGuid, description, registrationNumber } =
      organizationData;

    const createdOrganization = await this.organizationRepository.create(
      title,
      phone,
      email,
      cityGuid,
      creatorUserGuid,
      description,
      registrationNumber,
    );

    const member = await this.organizationRepository.addMember(
      createdOrganization,
      creatorUser,
      true,
    );
    createdOrganization.organizationMembers.push(member);

    return createdOrganization;
  }

  async updateOrganization(
    organizationGuid: string,
    organizationData: UpdateOrganizationDto,
  ): Promise<Organization> {
    await this.validate(organizationData);
    const { title, phone, email, cityGuid, registrationNumber } =
      organizationData;

    if (!(await this.organizationRepository.checkIfExists(organizationGuid))) {
      throw new NotFoundException(
        `Organization with GUID ${organizationGuid} does not exist`,
      );
    }

    return await this.organizationRepository.update(
      organizationGuid,
      title,
      phone,
      email,
      cityGuid,
      registrationNumber,
    );
  }

  async updateUserOrganization(
    userGuid: string,
    organizationGuid: string,
    organizationData: UpdateOrganizationDto,
  ): Promise<Organization> {
    await this.validate(organizationData);
    const {
      title,
      phone,
      email,
      cityGuid,
      description,
      registrationNumber,
      published,
    } = organizationData;

    if (
      !(await this.organizationRepository.checkIsAdmin(
        userGuid,
        organizationGuid,
      ))
    ) {
      throw new NotFoundException(
        `Organization with GUID ${organizationGuid} does not exist or not controlled by you`,
      );
    }

    return await this.organizationRepository.update(
      organizationGuid,
      title,
      phone,
      email,
      cityGuid,
      description,
      registrationNumber,
      published,
    );
  }

  async getOrganizationsByAdminGuid(userGuid: string): Promise<Organization[]> {
    return await this.organizationRepository.findByAdminGuid(userGuid);
  }
}
