const request = require('supertest');
const app = require('../../src/app');
const { connectDb, disconnectDb } = require('../../src/config/db');

beforeAll(async () => await connectDb());
afterAll(async () => await disconnectDb());

describe('routes/index (mounted routes)', () => {
  it('mounts user routes: POST /api/v1/user/register exists', async () => {
    const res = await request(app).post('/api/v1/user/register').send({
      email: 'routes@test.com',
      password: 'p',
      name: 'R',
    });
    expect([201, 400]).toContain(res.status);
  });

  it('mounts user routes: POST /api/v1/user/login exists', async () => {
    const res = await request(app).post('/api/v1/user/login').send({ email: 'a@b.com', password: 'p' });
    expect([200, 400, 401]).toContain(res.status);
  });

  it('mounts transaction routes: GET /transactions', async () => {
    const res = await request(app).get('/api/v1/transactions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('mounts transaction routes: GET /summary', async () => {
    const res = await request(app).get('/api/v1/summary');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('balance');
  });
});
