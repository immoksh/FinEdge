const request = require('supertest');
const app = require('../src/app');
const { connectDb, disconnectDb } = require('../src/config/db');

beforeAll(async () => await connectDb());
afterAll(async () => await disconnectDb());

describe('app', () => {
  it('exports an Express app', () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
  });

  it('GET /health returns 200 and status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.message).toBe('Server is running');
    expect(res.body.timestamp).toBeDefined();
  });

  it('parses JSON body', async () => {
    const res = await request(app)
      .post('/api/v1/user/register')
      .send({ email: 'app@test.com', password: 'p', name: 'App' });
    expect([201, 400]).toContain(res.status);
  });

  it('uses error handler for invalid route', async () => {
    const res = await request(app).get('/nonexistent-route');
    expect(res.status).toBe(404);
  });
});
