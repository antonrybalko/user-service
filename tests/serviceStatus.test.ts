import request from 'supertest';
import app from 'interface/web/server';

describe('GET /v1/', () => {
  it('should return a 200 status code and the correct response body', async () => {
    const response = await request(app).get('/v1/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });
});
