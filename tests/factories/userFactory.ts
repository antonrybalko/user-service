import { UserEntity } from 'infrastructure/persistence/entity/UserEntity';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export const createUser = async (overrides: Partial<UserEntity> = {}) => {
  const user = new UserEntity();
  user.guid = faker.string.uuid();
  user.username = faker.internet.userName();
  user.password = await bcrypt.hash(faker.internet.password(), 10);
  user.isAdmin = false;
  user.isVendor = false;
  user.firstname = faker.person.firstName();
  user.lastname = faker.person.lastName();
  user.email = faker.internet.email();
  user.phoneNumber = '7' + faker.string.numeric(10);
  user.status = 1;

  return Object.assign(user, overrides);
};
