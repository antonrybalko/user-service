import request from 'supertest';
import app from 'interface/web/server';
import { AppDataSource } from 'infrastructure/persistence/data-source';
import { UserEntity } from 'infrastructure/persistence/entity/UserEntity';

const testUsers = [
    {
        username: 'userwithemail',
        password: 'userwithemail',
        email: 'userwithemail@example.com',
        firstname: 'John Email',
    },
    {
        username: 'userwithphone',
        password: 'userwithphone',
        phoneNumber: '79129921234',
        firstname: 'John Phone',
    },
];

beforeAll(async () => {
    await AppDataSource.initialize();
});

afterAll(async () => {
    const userRepository = AppDataSource.getRepository(UserEntity);
    for (const userData of testUsers) {
        await userRepository.delete({ username: userData.username });
    }
    await AppDataSource.destroy();
});

describe('POST /v1/register', () => {
    it('should register a new user with valid data (email)', async () => {
        const response = await request(app).post('/v1/register').send(testUsers[0]);

        expect(response.status).toBe(201);
        expect(response.body.username).toBe('userwithemail');
    });

    it('should register a new user with valid data (phone)', async () => {
        const response = await request(app).post('/v1/register').send(testUsers[1]);

        expect(response.status).toBe(201);
        expect(response.body.username).toBe('userwithphone');
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
            username: 'userwithemail',
            password: 'duplicateuser',
            email: 'duplicateuser@example.com',
            firstname: 'Duplicate User',
        });

        expect(response.status).toBe(409);
    });

    it('should return 409 for duplicate email', async () => {
        const response = await request(app).post('/v1/register').send({
            username: 'testuser',
            password: 'testuser',
            email: 'userwithemail@example.com',
            firstname: 'Duplicate Email',
        });

        expect(response.status).toBe(409);
    });

    it('should return 400 for invalid email format', async () => {
        const response = await request(app).post('/v1/register').send({
            username: 'invalidemailuser',
            password: 'password123',
            email: 'invalidemail',
            firstname: 'Invalid',
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
            firstname: 'Short',
            lastname: 'Username',
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
