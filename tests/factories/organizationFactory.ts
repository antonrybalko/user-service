import { OrganizationEntity } from 'infrastructure/persistence/entity/OrganizationEntity';
import { faker } from '@faker-js/faker';
import { generatePhoneNumber } from './helpers';

export const createOrganization = (
  overrides: Partial<OrganizationEntity> = {},
) => {
  const organization = new OrganizationEntity();
  organization.guid = faker.string.uuid();
  organization.title = faker.company.name();
  organization.cityGuid = faker.string.uuid();
  organization.phoneNumber = generatePhoneNumber();
  organization.email = faker.internet.email();
  organization.registrationNumber = faker.string.uuid();
  organization.createdByUserGuid = faker.string.uuid();

  return Object.assign(organization, overrides);
};
