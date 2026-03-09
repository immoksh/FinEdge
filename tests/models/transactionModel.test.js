const Transaction = require('../../src/models/transactionModel');
const { connectDb, disconnectDb } = require('../../src/config/db');

beforeAll(async () => await connectDb());
afterAll(async () => await disconnectDb());

describe('Transaction model', () => {
  afterEach(async () => {
    await Transaction.deleteMany({});
  });

  it('exports TYPES', () => {
    expect(Transaction.TYPES).toEqual({ income: 'income', expense: 'expense' });
  });

  it('creates a transaction with required fields', async () => {
    const t = await Transaction.create({
      type: 'income',
      amount: 100,
      category: 'salary',
    });
    expect(t._id).toBeDefined();
    expect(t.type).toBe('income');
    expect(t.amount).toBe(100);
    expect(t.category).toBe('salary');
    expect(t.date).toBeDefined();
    expect(t.userId).toBeNull();
    expect(t.createdAt).toBeDefined();
    expect(t.updatedAt).toBeDefined();
  });

  it('defaults category to uncategorized', async () => {
    const t = await Transaction.create({ type: 'expense', amount: 50 });
    expect(t.category).toBe('uncategorized');
  });

  it('rejects invalid type', async () => {
    await expect(
      Transaction.create({ type: 'invalid', amount: 10 })
    ).rejects.toThrow();
  });

  it('rejects negative amount', async () => {
    await expect(
      Transaction.create({ type: 'income', amount: -10 })
    ).rejects.toThrow();
  });
});
