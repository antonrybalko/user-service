import { Service, Inject } from 'typedi';
import { Organization } from 'domain/entity/Organization';
import BaseUseCaseService from 'application/usecase/shared/BaseUseCaseService';
import { OrganizationRepositoryInterface } from './OrganizationRepositoryInterface';
import { CreateOrganizationDto } from './CreateOrganizationDto';
import { UpdateOrganizationDto } from './UpdateOrganizationDto';
import { NotFoundException } from 'shared/exception/NotFoundException';
import { ManageUsersRepositoryInterface } from '../manageUsers/ManageUsersRepositoryInterface';

@Service()
export class OrganizationService extends BaseUseCaseService {
  @Inject('ManageUsersRepositoryInterface')
  private userRepository: ManageUsersRepositoryInterface;

  @Inject('OrganizationRepositoryInterface')
  private organizationRepository: OrganizationRepositoryInterface;

  async createOrganization(
    creatorUserGuid: string,
    organizationData: CreateOrganizationDto,
  ): Promise<Organization> {
    await this.validate(organizationData);

    const creatorUser = await this.userRepository.findByGuid(creatorUserGuid);

    const { title, phoneNumber, email, cityGuid, registrationNumber } =
      organizationData;

    const createdOrganization = await this.organizationRepository.create(
      title,
      phoneNumber,
      email,
      cityGuid,
      creatorUserGuid,
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
    const { title, phoneNumber, email, cityGuid, registrationNumber } =
      organizationData;

    if (!(await this.organizationRepository.checkIfExists(organizationGuid))) {
      throw new NotFoundException(
        `Organization with GUID ${organizationGuid} does not exist`,
      );
    }

    return await this.organizationRepository.update(
      organizationGuid,
      title,
      phoneNumber,
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
    const { title, phoneNumber, email, cityGuid, registrationNumber } =
      organizationData;

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
      phoneNumber,
      email,
      cityGuid,
      registrationNumber,
    );
  }

  async getOrganizationsByAdminGuid(userGuid: string): Promise<Organization[]> {
    return await this.organizationRepository.findByAdminGuid(userGuid);
  }
}
