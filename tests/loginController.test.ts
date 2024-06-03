import request from 'supertest';
import app from 'interface/web/server';
import { AppDataSource } from 'infrastructure/persistence/data-source';
import { UserEntity } from 'infrastructure/persistence/entity/UserEntity';

beforeAll(async () => {
  await AppDataSource.initialize();

  // Prerequisite: Create a user for login
  await request(app).post('/v1/register').send({
    username: 'testuser',
    password: 'testpassword',
    email: 'testuser@example.com',
    firstname: 'John',
  });
});

afterAll(async () => {
  // Cleanup: Delete the user created for login
  const userRepository = AppDataSource.getRepository(UserEntity);
  await userRepository.delete({ username: 'testuser' });

  await AppDataSource.destroy();
});

describe('POST /login', () => {
  it('should return a token for valid credentials', async () => {
    const response = await request(app)
      .post('/v1/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should return 400 for missing credentials', async () => {
    const response = await request(app).post('/v1/login').send({});

    expect(response.status).toBe(400);
  });

  it('should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/v1/login')
      .send({ username: 'invaliduser', password: 'invalidpassword' });

    expect(response.status).toBe(401);
  });
});
