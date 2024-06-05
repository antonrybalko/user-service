import request from 'supertest';
import app from 'interface/web/server';
import { AppDataSource } from 'infrastructure/persistence/data-source';
import { UserEntity } from 'infrastructure/persistence/entity/UserEntity';
import { OrganizationEntity } from 'infrastructure/persistence/entity/OrganizationEntity';
import { createUserAndToken } from '../factories/tokenFactory';
import { createOrganization } from '../factories/organizationFactory';
import { Sanitizer } from 'class-sanitizer';

describe('POST /v1/me/organizations', () => {
  let token: string;
  let user: UserEntity;
  const organizationData = createOrganization();

  beforeAll(async () => {
    const userAndToken = await createUserAndToken();
    user = userAndToken.user;
    token = userAndToken.token;
  });

  afterAll(async () => {
    const organizationRepository =
      AppDataSource.getRepository(OrganizationEntity);
    await organizationRepository.delete({ title: organizationData.title });
    await AppDataSource.manager.remove(user);
    await AppDataSource.destroy();
  });

  it('should create a new organization', async () => {
    const response = await request(app)
      .post('/v1/me/organizations')
      .set('Authorization', `Bearer ${token}`)
      .send(organizationData);

    expect(response.body).toMatchObject({
      guid: expect.any(String),
      title: organizationData.title,
      cityGuid: organizationData.cityGuid,
      phoneNumber: organizationData.phoneNumber,
      email: Sanitizer.normalizeEmail(organizationData.email),
      registrationNumber: organizationData.registrationNumber,
      status: 'suspended',
    });
    expect(response.status).toBe(201);
  });

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/v1/me/organizations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',
        cityGuid: 'invalid-guid',
        phoneNumber: '12345',
        email: 'invalidemail',
      });

    expect(response.status).toBe(400);
  });

  it('should return 401 for missing token', async () => {
    const response = await request(app)
      .post('/v1/me/organizations')
      .send(organizationData);

    expect(response.status).toBe(401);
  });
});
