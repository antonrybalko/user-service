import request from 'supertest';
import app from 'interface/web/server';
import { AppDataSource } from 'infrastructure/persistence/data-source';
import { UserEntity } from 'infrastructure/persistence/entity/UserEntity';
import { OrganizationEntity } from 'infrastructure/persistence/entity/OrganizationEntity';
import { createUserAndToken } from '../factories/tokenFactory';
import { createOrganization } from '../factories/organizationFactory';
import { Sanitizer } from 'class-sanitizer';

describe('Organizations', () => {
  let token: string;
  let user: UserEntity;
  const organizationData = createOrganization();
  let organizationGuid: string;

  beforeAll(async () => {
    await AppDataSource.initialize();
    const userAndToken = await createUserAndToken();
    user = userAndToken.user;
    token = userAndToken.token;
  });

  afterAll(async () => {
    const organizationRepository =
      AppDataSource.getRepository(OrganizationEntity);
    const userRepository = AppDataSource.getRepository(UserEntity);
    await organizationRepository.delete({ title: organizationData.title });
    await organizationRepository.delete({ guid: organizationGuid });
    await userRepository.delete({ username: user.username });
    await AppDataSource.destroy();
  });

  describe('POST /v1/me/organizations', () => {
    it('should create a new organization', async () => {
      const response = await request(app)
        .post('/v1/me/organizations')
        .set('Authorization', `Bearer ${token}`)
        .send(organizationData);

      organizationGuid = response.body.guid;

      expect(response.body).toMatchObject({
        guid: expect.any(String),
        title: organizationData.title,
        cityGuid: organizationData.cityGuid,
        phone: organizationData.phone,
        email: Sanitizer.normalizeEmail(organizationData.email),
        registrationNumber: organizationData.registrationNumber,
        published: false,
        status: 'active',
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
          phone: '12345',
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

  describe('PATCH /v1/me/organizations/:guid', () => {
    it('should update an existing organization', async () => {
      const updatedData = createOrganization({
        published: true,
      });

      const response = await request(app)
        .patch(`/v1/me/organizations/${organizationGuid}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdByUserGuid, ...expectedData } = updatedData;
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        ...expectedData,
        guid: organizationGuid,
        email: Sanitizer.normalizeEmail(updatedData.email),
      });
    });

    it('should not allow a non-admin user to update an organization', async () => {
      const newUserAndToken = await createUserAndToken();

      const updateResponse = await request(app)
        .patch(`/v1/me/organizations/${organizationGuid}`)
        .set('Authorization', `Bearer ${newUserAndToken.token}`)
        .send({
          title: 'Updated Organization Title',
        });

      expect(updateResponse.status).toBe(404);
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .patch(`/v1/me/organizations/${organizationGuid}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '',
          cityGuid: 'invalid-guid',
          phone: '12345',
          email: 'invalidemail',
        });

      expect(response.status).toBe(400);
    });

    it('should return 401 for missing token', async () => {
      const response = await request(app)
        .patch(`/v1/me/organizations/${organizationGuid}`)
        .send(organizationData);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /v1/me', () => {
    let token: string;
    let user: UserEntity;
    const organizationData1 = createOrganization();
    const organizationData2 = createOrganization();

    beforeAll(async () => {
      const userAndToken = await createUserAndToken();
      user = userAndToken.user;
      token = userAndToken.token;
    });

    afterAll(async () => {
      const organizationRepository =
        AppDataSource.getRepository(OrganizationEntity);
      await organizationRepository.delete({ title: organizationData1.title });
      await organizationRepository.delete({ title: organizationData2.title });
      await AppDataSource.manager.remove(user);
    });

    it('should return user info including two organizations', async () => {
      const orgResponse1 = await request(app)
        .post('/v1/me/organizations')
        .set('Authorization', `Bearer ${token}`)
        .send(organizationData1);

      const orgResponse2 = await request(app)
        .post('/v1/me/organizations')
        .set('Authorization', `Bearer ${token}`)
        .send(organizationData2);

      const response = await request(app)
        .get('/v1/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.organizations).toEqual([
        {
          guid: orgResponse1.body.guid,
          title: organizationData1.title,
          email: Sanitizer.normalizeEmail(organizationData1.email),
          phone: organizationData1.phone,
          cityGuid: organizationData1.cityGuid,
          description: organizationData1.description,
          registrationNumber: organizationData1.registrationNumber,
          published: false,
          status: 'active',
        },
        {
          guid: orgResponse2.body.guid,
          title: organizationData2.title,
          email: Sanitizer.normalizeEmail(organizationData2.email),
          phone: organizationData2.phone,
          cityGuid: organizationData2.cityGuid,
          description: organizationData2.description,
          registrationNumber: organizationData2.registrationNumber,
          published: false,
          status: 'active',
        },
      ]);
    });
  });
});
