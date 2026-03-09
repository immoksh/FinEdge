const request = require('supertest');
const app = require('../../src/app');
const { connectDb, disconnectDb } = require('../../src/config/db');

beforeAll(async () => await connectDb());
afterAll(async () => await disconnectDb());

describe('userController', () => {
  describe('POST /api/v1/user/register', () => {
    it('returns 201 and user on success', async () => {
      const res = await request(app)
        .post('/api/v1/user/register')
        .send({ email: 'ctrl@test.com', password: 'pass', name: 'Ctrl User' });
      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('ctrl@test.com');
    });

    it('returns 400 when body invalid', async () => {
      const res = await request(app).post('/api/v1/user/register').send({ email: 'a@b.com' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/user/login', () => {
    it('returns 200 with user and token for valid credentials', async () => {
      await request(app)
        .post('/api/v1/user/register')
        .send({ email: 'loginctrl@test.com', password: 'mypass', name: 'Login' });
      const res = await request(app)
        .post('/api/v1/user/login')
        .send({ email: 'loginctrl@test.com', password: 'mypass' });
      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.token).toBeDefined();
    });

    it('returns 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/user/login')
        .send({ email: 'nobody@test.com', password: 'wrong' });
      expect(res.status).toBe(401);
    });
  });
});
