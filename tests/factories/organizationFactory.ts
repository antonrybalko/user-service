import { OrganizationEntity } from 'adapter/persistence/entity/OrganizationEntity';
import { faker } from '@faker-js/faker';
import { generatePhoneNumber } from './helpers';

export const createOrganization = (
  overrides: Partial<OrganizationEntity> = {},
) => {
  const organization = new OrganizationEntity();
  organization.guid = faker.string.uuid();
  organization.title = faker.company.name();
  organization.cityGuid = faker.string.uuid();
  organization.phone = generatePhoneNumber();
  organization.email = faker.internet.email();
  organization.description = faker.lorem.sentence(100);
  organization.registrationNumber = faker.string.uuid();
  organization.createdByUserGuid = faker.string.uuid();

  return Object.assign(organization, overrides);
};
