import request from 'supertest';
import app from 'presentation/web/server';
import { AppDataSource } from 'infrastructure/persistence/data-source';
import { UserEntity } from 'infrastructure/persistence/entity/UserEntity';
import { createUser } from './factories/userFactory';
import { PasswordService } from 'infrastructure/security/PasswordService';

let usersData: UserEntity[] = [];

beforeAll(async () => {
  usersData = await Promise.all([
    createUser({ status: 1 }), // Active user
    createUser({ status: 0 }), // Inactive user
    createUser({ status: 2 }), // Deleted user
    createUser({ status: 3 }), // Blocked user
  ]);

  await AppDataSource.initialize();
  const userRepository = AppDataSource.getRepository(UserEntity);
  const passwordService = new PasswordService();

  await userRepository.save(
    await Promise.all(
      usersData.map(async (user) => {
        return {
          ...user,
          password: await passwordService.hashPassword(user.password),
        };
      }),
    ),
  );
});

afterAll(async () => {
  const userRepository = AppDataSource.getRepository(UserEntity);
  for (const user of usersData) {
    await userRepository.delete({ username: user.username });
  }

  await AppDataSource.destroy();
});

describe('POST /login', () => {
  it('should return a token for valid credentials', async () => {
    const user = usersData[0];
    const response = await request(app)
      .post('/v1/login')
      .send({ username: user.username, password: user.password });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });

  it('should return 400 for missing credentials', async () => {
    const response = await request(app).post('/v1/login').send({});

    expect(response.status).toBe(400);
  });

  it('should return 401 for invalid password', async () => {
    const response = await request(app)
      .post('/v1/login')
      .send({ username: usersData[0].username, password: 'invalidpassword' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid username or password');
  });

  it('should return 401 for non-existent user', async () => {
    const response = await request(app)
      .post('/v1/login')
      .send({ username: 'nonexistentuser', password: 'password' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid username or password');
  });

  it('should return 401 for inactive user', async () => {
    const user = usersData[1];
    const response = await request(app)
      .post('/v1/login')
      .send({ username: user.username, password: user.password });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('User is not active');
  });

  it('should return 401 for blocked user', async () => {
    const user = usersData[3];
    const response = await request(app)
      .post('/v1/login')
      .send({ username: user.username, password: user.password });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('User is not active');
  });

  it('should return 401 for deleted user', async () => {
    const user = usersData[2];
    const response = await request(app)
      .post('/v1/login')
      .send({ username: user.username, password: user.password });

    expect(response.body.error).toBe('User is not active');
    expect(response.status).toBe(401);
  });

  it('should return 400 for invalid request body', async () => {
    const response = await request(app).post('/v1/login').send({ foo: 'bar' });

    expect(response.status).toBe(400);
  });
});
