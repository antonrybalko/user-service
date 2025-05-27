import { Organization } from 'entity/Organization';
import { OrganizationMember } from 'entity/OrganizationMember';
import { User } from 'entity/User';

export interface OrganizationRepositoryInterface {
  create(
    title: string,
    phone: string,
    email: string,
    cityGuid: string,
    createdByUserGuid: string,
    description?: string,
    registrationNumber?: string,
  ): Promise<Organization>;

  update(
    guid: string,
    title?: string,
    phone?: string,
    email?: string,
    cityGuid?: string,
    description?: string,
    registrationNumber?: string,
    published?: boolean,
  ): Promise<Organization>;

  findByGuid(guid: string): Promise<Organization>;

  findByAdminGuid(guid: string): Promise<Organization[]>;

  checkIfExists(guid: string): Promise<boolean>;

  checkIsAdmin(userGuid: string, organizationGuid: string): Promise<boolean>;

  addMember(
    organization: Organization,
    user: User,
    isOrgAdmin: boolean,
  ): Promise<OrganizationMember>;
}
