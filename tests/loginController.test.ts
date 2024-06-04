import request from 'supertest';
import bcrypt from 'bcrypt';
import app from 'interface/web/server';
import { AppDataSource } from 'infrastructure/persistence/data-source';
import { UserEntity } from 'infrastructure/persistence/entity/UserEntity';


const testUsers = [
    {
        username: 'testuser',
        password: 'testuser',
        email: 'testuser@example.com',
        firstname: 'John',
        status: 1 // Active
    },
    {
        username: 'inactiveuser',
        password: 'inactiveuser',
        email: 'inactiveuser@example.com',
        firstname: 'Inactive',
        status: 0 // Inactive
    },
    {
        username: 'deleteduser',
        password: 'deleteduser',
        email: 'deleteduser@example.com',
        firstname: 'Deleted',
        status: 2 // Deleted
    },
    {
        username: 'blockeduser',
        password: 'blockeduser',
        email: 'blockeduser@example.com',
        firstname: 'Blocked',
        status: 3 // Blocked
    }
];

beforeAll(async () => {
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(UserEntity);
    for (const userData of testUsers) {
        const user = new UserEntity();
        user.username = userData.username;
        user.password = await bcrypt.hash(userData.password, 3);
        user.email = userData.email;
        user.firstname = userData.firstname;
        user.status = userData.status;
        await userRepository.save(user);
    }
});

afterAll(async () => {
    const userRepository = AppDataSource.getRepository(UserEntity);
    for (const userData of testUsers) {
        await userRepository.delete({ username: userData.username });
    }

    await AppDataSource.destroy();
});

describe('POST /login', () => {
    it('should return a token for valid credentials', async () => {
        const response = await request(app)
            .post('/v1/login')
            .send({ username: 'testuser', password: 'testuser' });

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
            .send({ username: 'testuser', password: 'invalidpassword' });

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
        const response = await request(app)
            .post('/v1/login')
            .send({ username: 'inactiveuser', password: 'inactiveuser' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('User is not active');
    });

    it('should return 401 for blocked user', async () => {
        const response = await request(app)
            .post('/v1/login')
            .send({ username: 'blockeduser', password: 'blockeduser' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('User is not active');
    });

    it('should return 401 for deleted user', async () => {
        const response = await request(app)
            .post('/v1/login')
            .send({ username: 'deleteduser', password: 'deleteduser' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('User is not active');
    });

    it('should return 400 for invalid request body', async () => {
        const response = await request(app).post('/v1/login').send({ foo: 'bar' });

        expect(response.status).toBe(400);
    });

    it('should return 400 for password less than 6 characters', async () => {
        const response = await request(app)
            .post('/v1/login')
            .send({ username: 'testuser', password: '12345' });
    });

});
