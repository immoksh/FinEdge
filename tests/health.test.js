const request = require('supertest');
const { connectDb, disconnectDb } = require('../src/config/db');
const app = require('../src/app');

beforeAll(async () => await connectDb());
afterAll(async () => await disconnectDb());

describe('GET /health', () => {
  it('returns 200 and server status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.message).toBe('Server is running');
    expect(res.body.timestamp).toBeDefined();
  });
});
