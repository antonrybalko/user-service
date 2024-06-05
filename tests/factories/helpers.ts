import { faker } from '@faker-js/faker';

export const generateUserName = () =>
  faker.string.alphanumeric({ length: { min: 3, max: 30 } });
export const generatePassword = () => faker.internet.password({ length: 6 });
export const generatePhoneNumber = () => '79' + faker.string.numeric(9);
