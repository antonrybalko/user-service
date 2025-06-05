import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from 'presentation/web/server';
import { AppDataSource } from 'adapter/persistence/data-source';
import { UserEntity } from 'adapter/persistence/entity/UserEntity';
import { TokenServiceInterface } from 'application/shared/port/TokenServiceInterface';
import { TokenService } from 'adapter/security/TokenService';

describe('GET /v1/me', () => {
  let user: UserEntity;
  let tokenService: TokenServiceInterface;
  let token: string;

  beforeAll(async () => {
    // Create a test user
    user = new UserEntity();
    user.guid = '123e4567-e89b-12d3-a456-426614174000';
    user.username = 'metestuser';
    user.password = 'password';
    user.isAdmin = false;
    user.isVendor = false;
    user.firstname = 'Test';
    user.lastname = 'User';
    user.status = 1;

    await AppDataSource.manager.save(user);

    tokenService = new TokenService();
    token = tokenService.generateToken(user.toDomainEntity());
  });

  afterAll(async () => {
    const userRepository = AppDataSource.getRepository(UserEntity);
    await userRepository.delete({ username: user.username });
  });

  it('should return user details for valid token', async () => {
    const response = await request(app)
      .get('/v1/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({
      guid: user.guid,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      status: 'active',
      isAdmin: user.isAdmin,
      isVendor: user.isVendor,
      organizations: [],
    });
  });

  it('should return 401 for missing token', async () => {
    await request(app).get('/v1/me').expect(401);
  });

  it('should return 401 for invalid token', async () => {
    await request(app)
      .get('/v1/me')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);
  });

  it('should return 401 for expired token', async () => {
    const expiredToken = jwt.sign(
      { guid: user.guid, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '-1h' },
    );

    await request(app)
      .get('/v1/me')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);
  });

  it('should return 401 for invalid guid field in token payload', async () => {
    const payload = {
      guid: '321e4567',
      username: 'invalidusername',
    };
    const invalidToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: Number(process.env.JWT_EXPIRES_IN),
    });

    await request(app)
      .get('/v1/me')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401);
  });

  it('should return 401 for missing guid token field', async () => {
    const payload = {
      username: 'testusername',
    };
    const invalidToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: Number(process.env.JWT_EXPIRES_IN),
    });

    await request(app)
      .get('/v1/me')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401);
  });
});
