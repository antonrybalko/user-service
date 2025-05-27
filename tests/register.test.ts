import request from 'supertest';
import app from 'presentation/web/server';
import { AppDataSource } from 'adapter/persistence/data-source';
import { UserEntity } from 'adapter/persistence/entity/UserEntity';
import { faker } from '@faker-js/faker';
import { createUser } from './factories/userFactory';
import { Sanitizer } from 'class-sanitizer';
import {
  generatePassword,
  generatePhoneNumber,
  generateUserName,
} from './factories/helpers';

let usersData: {
  userWithEmail: Partial<UserEntity>;
  userWithPhone: Partial<UserEntity>;
  userFull: Partial<UserEntity>;
};

beforeAll(async () => {
  const createUserShort = (extraFields: Partial<UserEntity>) => {
    return {
      username: generateUserName(),
      password: generatePassword(),
      firstname: faker.person.firstName(),
      ...extraFields,
    };
  };

  usersData = {
    userWithEmail: createUserShort({
      email: faker.internet.email(),
    }),
    userWithPhone: createUserShort({
      phone: generatePhoneNumber(),
    }),
    userFull: await createUser(),
  };
  await AppDataSource.initialize();
});

afterAll(async () => {
  const userRepository = AppDataSource.getRepository(UserEntity);
  for (const user of Object.values(usersData)) {
    await userRepository.delete({ username: user.username });
  }
  await AppDataSource.destroy();
});

describe('POST /v1/register', () => {
  it('should register a new user with valid data (email)', async () => {
    const response = await request(app)
      .post('/v1/register')
      .send(usersData.userWithEmail);

    expect(response.body).toMatchObject({
      username: usersData.userWithEmail.username,
      email: Sanitizer.normalizeEmail(usersData.userWithEmail.email ?? ''),
      firstname: usersData.userWithEmail.firstname,
    });
    expect(response.status).toBe(201);
  });

  it('should register a new user with valid data (phone)', async () => {
    const response = await request(app)
      .post('/v1/register')
      .send(usersData.userWithPhone);

    expect(response.body).toMatchObject({
      username: usersData.userWithPhone.username,
      phone: usersData.userWithPhone.phone,
      firstname: usersData.userWithPhone.firstname,
    });
    expect(response.status).toBe(201);
  });

  it('should register a new user with valid data (full)', async () => {
    const response = await request(app)
      .post('/v1/register')
      .send(usersData.userFull);

    expect(response.body).toEqual({
      guid: expect.any(String),
      username: usersData.userFull.username,
      email: Sanitizer.normalizeEmail(usersData.userFull.email ?? ''),
      firstname: usersData.userFull.firstname,
      lastname: usersData.userFull.lastname,
      phone: usersData.userFull.phone,
      isVendor: usersData.userFull.isVendor,
      status: 1, // ACTIVE
    });
    expect(response.status).toBe(201);
  });

  it('should return 400 for missing username', async () => {
    const response = await request(app).post('/v1/register').send({
      password: 'validpassword',
      email: 'missingusername@example.com',
      firstname: 'Missing Email',
    });

    expect(response.status).toBe(400);
  });

  it('should return 400 for missing password', async () => {
    const response = await request(app).post('/v1/register').send({
      username: 'missingpassword',
      email: 'missingpassword@example.com',
      firstname: 'Missing Password',
    });

    expect(response.status).toBe(400);
  });

  it('should return 400 for missing email and phone', async () => {
    const response = await request(app).post('/v1/register').send({
      username: 'missingemailphone',
      password: 'validpassword',
      firstname: 'Missing Email Phone',
    });

    expect(response.status).toBe(400);
  });

  it('should return 400 for missing firstname', async () => {
    const response = await request(app).post('/v1/register').send({
      username: 'missingfirstname',
      password: 'validpassword',
      email: 'missingfirstname@example.com',
    });

    expect(response.status).toBe(400);
  });

  it('should return 409 for duplicate username', async () => {
    const response = await request(app).post('/v1/register').send({
      username: usersData.userFull.username,
      password: 'validpassword',
      email: faker.internet.email(),
      firstname: 'Duplicate username',
    });

    expect(response.status).toBe(409);
  });

  it('should return 409 for duplicate email', async () => {
    const response = await request(app).post('/v1/register').send({
      username: generateUserName(),
      password: 'validpassword',
      email: usersData.userFull.email,
      firstname: 'Duplicate Email',
    });

    expect(response.status).toBe(409);
  });

  it('should return 400 for invalid email format', async () => {
    const response = await request(app).post('/v1/register').send({
      username: 'invalidemailuser',
      password: 'password123',
      email: 'invalidemail',
      firstname: 'Invalid email',
    });

    expect(response.status).toBe(400);
  });

  it('should return 400 for password less than 6 characters', async () => {
    const response = await request(app).post('/v1/register').send({
      username: 'shortpassworduser',
      password: 'short',
      email: 'shortpassworduser@example.com',
      firstname: 'Short Password',
    });

    expect(response.status).toBe(400);
  });

  it('should return 400 for username less than 3 characters', async () => {
    const response = await request(app).post('/v1/register').send({
      username: 'ab',
      password: 'validpassword',
      email: 'shortusername@example.com',
      firstname: 'Short Username',
    });

    expect(response.status).toBe(400);
  });

  it('should return 400 for invalid request body', async () => {
    const response = await request(app)
      .post('/v1/register')
      .send({ foo: 'bar' });

    expect(response.status).toBe(400);
  });
});
