const transactionService = require('../../src/services/transactionService');
const Transaction = require('../../src/models/transactionModel');
const { connectDb, disconnectDb } = require('../../src/config/db');

beforeAll(async () => await connectDb());
afterAll(async () => await disconnectDb());

describe('transactionService', () => {
  afterEach(async () => {
    await Transaction.deleteMany({});
  });

  describe('addTransaction', () => {
    it('throws ValidationError for invalid type', async () => {
      await expect(
        transactionService.addTransaction({ type: 'invalid', amount: 10 })
      ).rejects.toThrow();
    });

    it('throws ValidationError for invalid amount', async () => {
      await expect(
        transactionService.addTransaction({ type: 'income', amount: -5 })
      ).rejects.toThrow();
    });

    it('creates transaction when valid', async () => {
      const t = await transactionService.addTransaction({
        type: 'income',
        amount: 100,
        category: 'salary',
      });
      expect(t._id).toBeDefined();
      expect(t.type).toBe('income');
      expect(t.amount).toBe(100);
    });
  });

  describe('getAllTransactions', () => {
    it('returns empty array when no transactions', async () => {
      const list = await transactionService.getAllTransactions();
      expect(list).toEqual([]);
    });

    it('returns transactions', async () => {
      await Transaction.create({ type: 'income', amount: 50 });
      const list = await transactionService.getAllTransactions();
      expect(list.length).toBe(1);
      expect(list[0].amount).toBe(50);
    });
  });

  describe('getTransactionById', () => {
    it('throws NotFoundError when not found', async () => {
      const mongoose = require('mongoose');
      const fakeId = new mongoose.Types.ObjectId();
      await expect(transactionService.getTransactionById(fakeId)).rejects.toThrow(/not found/i);
    });

    it('returns transaction when found', async () => {
      const created = await Transaction.create({ type: 'expense', amount: 20, category: 'food' });
      const t = await transactionService.getTransactionById(created._id.toString());
      expect(t.amount).toBe(20);
      expect(t.category).toBe('food');
    });
  });

  describe('getSummary', () => {
    it('returns zero summary when no transactions', async () => {
      const summary = await transactionService.getSummary();
      expect(summary.totalIncome).toBe(0);
      expect(summary.totalExpense).toBe(0);
      expect(summary.balance).toBe(0);
      expect(summary.transactionCount).toBe(0);
    });

    it('aggregates income and expense', async () => {
      await Transaction.create({ type: 'income', amount: 100 });
      await Transaction.create({ type: 'expense', amount: 30 });
      const summary = await transactionService.getSummary();
      expect(summary.totalIncome).toBe(100);
      expect(summary.totalExpense).toBe(30);
      expect(summary.balance).toBe(70);
      expect(summary.transactionCount).toBe(2);
    });
  });
});
