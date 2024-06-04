import request from 'supertest';
import { AppDataSource } from 'infrastructure/persistence/data-source';
import app from 'interface/web/server';
import { UserEntity } from 'infrastructure/persistence/entity/UserEntity';
import { OrganizationEntity } from 'infrastructure/persistence/entity/OrganizationEntity';
import { TokenService } from 'infrastructure/security/TokenService';
import { stat } from 'fs';

const testOrganization = {
    title: 'Test Organization',
    cityGuid: '321e4567-e89b-12d3-a456-426614174000',
    phoneNumber: '79129922345',
    email: 'org@example.com',
    registrationNumber: '1122334455'
};

describe('POST /v1/me/organizations', () => {
    let token: string;
    let user: UserEntity;

    beforeAll(async () => {
        await AppDataSource.initialize();

        // Create a test user
        user = new UserEntity();
        user.guid = '123e4567-e89b-12d3-a456-426614174000';
        user.username = 'orgtestuser';
        user.password = 'password';
        user.email = 'orgtestuser@example.com'
        user.isAdmin = false;
        user.isVendor = true;
        user.firstname = 'Test';
        user.lastname = 'User';
        user.status = 1;
        await AppDataSource.manager.save(user);

        // Generate a token for the user
        const tokenService = new TokenService();
        token = tokenService.generateToken(user.toDomainEntity());
    });

    afterAll(async () => {
        const organizationRepository = AppDataSource.getRepository(OrganizationEntity);
        await organizationRepository.delete({ title: testOrganization.title });
        await AppDataSource.manager.remove(user);
        await AppDataSource.destroy();
    });

    it('should create a new organization', async () => {
        const response = await request(app)
            .post('/v1/me/organizations')
            .set('Authorization', `Bearer ${token}`)
            .send(testOrganization);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            guid: expect.any(String),
            title: testOrganization.title,
            cityGuid: testOrganization.cityGuid,
            phoneNumber: testOrganization.phoneNumber,
            email: testOrganization.email,
            registrationNumber: testOrganization.registrationNumber,
            status: 'suspended',
        });
    });

    it('should return 400 for invalid input', async () => {
        const response = await request(app)
            .post('/v1/me/organizations')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: '',
                cityGuid: 'invalid-guid',
                phoneNumber: '12345',
                email: 'invalidemail'
            });

        expect(response.status).toBe(400);
    });

    it('should return 401 for missing token', async () => {
        const response = await request(app)
            .post('/v1/me/organizations')
            .send(testOrganization);

        expect(response.status).toBe(401);
    });
});
