const request = require('supertest');
const app = require('../../src/app');
const { connectDb, disconnectDb } = require('../../src/config/db');

beforeAll(async () => await connectDb());
afterAll(async () => await disconnectDb());

describe('transactionController', () => {
  let transactionId;

  describe('POST /api/v1/transactions', () => {
    it('returns 201 and transaction', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .send({ type: 'income', amount: 200, category: 'salary' });
      expect(res.status).toBe(201);
      expect(res.body.type).toBe('income');
      expect(res.body.amount).toBe(200);
      transactionId = res.body._id || res.body.id;
    });

    it('returns 400 for invalid body', async () => {
      const res = await request(app).post('/api/v1/transactions').send({ type: 'invalid', amount: 10 });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/transactions', () => {
    it('returns 200 and array', async () => {
      const res = await request(app).get('/api/v1/transactions');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/v1/transactions/:id', () => {
    it('returns 200 and transaction when found', async () => {
      if (!transactionId) {
        const create = await request(app).post('/api/v1/transactions').send({ type: 'income', amount: 1 });
        transactionId = create.body._id || create.body.id;
      }
      const res = await request(app).get(`/api/v1/transactions/${transactionId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('amount');
    });

    it('returns 404 for invalid id', async () => {
      const res = await request(app).get('/api/v1/transactions/507f1f77bcf86cd799439011');
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/v1/summary', () => {
    it('returns 200 and summary', async () => {
      const res = await request(app).get('/api/v1/summary');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalIncome');
      expect(res.body).toHaveProperty('totalExpense');
      expect(res.body).toHaveProperty('balance');
    });
  });
});
