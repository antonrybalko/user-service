import { faker } from '@faker-js/faker';
import { UserEntity } from 'adapter/persistence/entity/UserEntity';
import {
  generatePassword,
  generatePhoneNumber,
  generateUserName,
} from './helpers';

export const createUser = async (overrides: Partial<UserEntity> = {}) => {
  const user = new UserEntity();
  user.guid = faker.string.uuid();
  user.username = generateUserName();
  user.password = generatePassword();
  user.isAdmin = false;
  user.isVendor = false;
  user.firstname = faker.person.firstName();
  user.lastname = faker.person.lastName();
  user.email = faker.internet.email();
  user.phone = generatePhoneNumber();

  return Object.assign(user, overrides);
};
