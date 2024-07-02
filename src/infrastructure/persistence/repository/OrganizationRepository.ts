import { Repository } from 'typeorm';
import { Organization } from 'domain/entity/Organization';
import { OrganizationRepositoryInterface } from 'application/usecase/organization/OrganizationRepositoryInterface';
import { OrganizationMember } from 'domain/entity/OrganizationMember';
import { AppDataSource } from '../data-source';
import { OrganizationEntity } from '../entity/OrganizationEntity';
import { OrganizationMemberEntity } from '../entity/OrganizationMemberEntity';
import { NotFoundException } from 'shared/exception/NotFoundException';
import { Service } from 'typedi';
import { UserEntity } from '../entity/UserEntity';
import { User } from 'domain/entity/User';

@Service()
export class OrganizationRepository implements OrganizationRepositoryInterface {
  private userRepository: Repository<UserEntity>;
  private organizationRepository: Repository<OrganizationEntity>;
  private organizationMemberRepository: Repository<OrganizationMemberEntity>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(UserEntity);
    this.organizationRepository =
      AppDataSource.getRepository(OrganizationEntity);
    this.organizationMemberRepository = AppDataSource.getRepository(
      OrganizationMemberEntity,
    );
  }

  async create(
    title: string,
    phone: string,
    email: string,
    cityGuid: string,
    createdByUserGuid: string,
    description?: string,
    registrationNumber?: string,
  ): Promise<Organization> {
    const createdByUser = await this.userRepository.findOneBy({
      guid: createdByUserGuid,
    });
    if (!createdByUser) {
      throw new NotFoundException('User not found');
    }
    const organization = new OrganizationEntity();
    organization.title = title;
    organization.phone = phone;
    organization.email = email;
    organization.cityGuid = cityGuid;
    organization.createdByUser = createdByUser;
    organization.description = description;
    organization.registrationNumber = registrationNumber;

    const createdOrganization =
      await this.organizationRepository.save(organization);
    createdOrganization.organizationMembers = [];
    return createdOrganization.toDomainEntity();
  }

  async update(
    guid: string,
    title?: string,
    phone?: string,
    email?: string,
    cityGuid?: string,
    description?: string,
    registrationNumber?: string,
    published?: boolean,
  ): Promise<Organization> {
    const organization = await this.organizationRepository.findOneBy({ guid });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    if (title) {
      organization.title = title;
    }
    if (phone) {
      organization.phone = phone;
    }
    if (email) {
      organization.email = email;
    }
    if (cityGuid) {
      organization.cityGuid = cityGuid;
    }
    if (description) {
      organization.description = description;
    }
    if (registrationNumber) {
      organization.registrationNumber = registrationNumber;
    }
    if (published !== undefined) {
      organization.published = published;
    }

    const updatedOrganization =
      await this.organizationRepository.save(organization);

    return updatedOrganization.toDomainEntity();
  }

  async findByGuid(guid: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOneBy({ guid });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization.toDomainEntity();
  }

  async findByAdminGuid(guid: string): Promise<Organization[]> {
    const organizations = await this.organizationRepository
      .createQueryBuilder('organization')
      .innerJoinAndSelect(
        'organization.organizationMembers',
        'member',
        'member.userGuid = :guid AND member.isOrgAdmin = true',
        { guid },
      )
      .getMany();

    return organizations.map((organization) => organization.toDomainEntity());
  }

  async checkIfExists(guid: string): Promise<boolean> {
    const organization = await this.organizationRepository.findOneBy({ guid });
    return !!organization;
  }

  async checkIsAdmin(
    userGuid: string,
    organizationGuid: string,
  ): Promise<boolean> {
    const organizationMember =
      await this.organizationMemberRepository.findOneBy({
        organizationGuid: organizationGuid,
        userGuid: userGuid,
        isOrgAdmin: true,
      });
    return !!organizationMember;
  }

  async addMember(
    organization: Organization,
    user: User,
    isOrgAdmin: boolean,
  ): Promise<OrganizationMember> {
    const organizationMember = new OrganizationMemberEntity();
    organizationMember.organizationGuid = organization.guid;
    organizationMember.userGuid = user.guid;
    organizationMember.isOrgAdmin = isOrgAdmin;
    await this.organizationMemberRepository.save(organizationMember);
    return organizationMember.toDomainEntity();
  }
}
