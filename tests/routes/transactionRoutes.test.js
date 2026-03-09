const request = require('supertest');
const app = require('../../src/app');
const { connectDb, disconnectDb } = require('../../src/config/db');

beforeAll(async () => await connectDb());
afterAll(async () => await disconnectDb());

describe('transactionRoutes', () => {
  let id;

  it('POST /transactions creates transaction', async () => {
    const res = await request(app)
      .post('/api/v1/transactions')
      .send({ type: 'expense', amount: 25, category: 'food' });
    expect(res.status).toBe(201);
    expect(res.body.type).toBe('expense');
    id = res.body._id || res.body.id;
  });

  it('GET /transactions returns list', async () => {
    const res = await request(app).get('/api/v1/transactions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /transactions/:id returns one', async () => {
    if (!id) return;
    const res = await request(app).get(`/api/v1/transactions/${id}`);
    expect(res.status).toBe(200);
  });

  it('PATCH /transactions/:id updates', async () => {
    if (!id) return;
    const res = await request(app).patch(`/api/v1/transactions/${id}`).send({ amount: 30 });
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(30);
  });

  it('DELETE /transactions/:id removes', async () => {
    if (!id) return;
    const res = await request(app).delete(`/api/v1/transactions/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.deleted).toBe(true);
  });

  it('GET /summary returns summary', async () => {
    const res = await request(app).get('/api/v1/summary');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalIncome');
    expect(res.body).toHaveProperty('totalExpense');
    expect(res.body).toHaveProperty('balance');
  });
});
