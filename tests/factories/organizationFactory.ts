import { OrganizationEntity } from 'infrastructure/persistence/entity/OrganizationEntity';
import { faker } from '@faker-js/faker';

export const createOrganization = (
  overrides: Partial<OrganizationEntity> = {},
) => {
  const organization = new OrganizationEntity();
  organization.guid = faker.string.uuid();
  organization.title = faker.company.name();
  organization.cityGuid = faker.string.uuid();
  organization.phoneNumber = '79' + faker.string.numeric(9);
  organization.email = faker.internet.email();
  organization.registrationNumber = faker.string.uuid();
  organization.createdByUserGuid = faker.string.uuid();

  return Object.assign(organization, overrides);
};
