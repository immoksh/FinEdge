const request = require('supertest');
const app = require('../../src/app');
const { connectDb, disconnectDb } = require('../../src/config/db');

beforeAll(async () => await connectDb());
afterAll(async () => await disconnectDb());

describe('userRoutes', () => {
  it('POST /api/v1/user/register creates user', async () => {
    const res = await request(app)
      .post('/api/v1/user/register')
      .send({ email: 'routeuser@test.com', password: 'secret', name: 'Route User' });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('routeuser@test.com');
  });

  it('POST /api/v1/user/login returns token for valid user', async () => {
    await request(app)
      .post('/api/v1/user/register')
      .send({ email: 'logroute@test.com', password: 'pass', name: 'Log' });
    const res = await request(app)
      .post('/api/v1/user/login')
      .send({ email: 'logroute@test.com', password: 'pass' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
