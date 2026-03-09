const Transaction = require('../models/transactionModel');
const { NotFoundError, ValidationError } = require('../errors');
const { TYPES } = Transaction;

async function getAllTransactions(userId = null, filters = {}) {
  const query = { userId };
  if (filters.category) query.category = filters.category;
  if (filters.date) {
    query.date = { $regex: new RegExp(`^${filters.date}`) };
  }
  const list = await Transaction.find(query).sort({ createdAt: -1 }).lean();
  return list;
}

async function getTransactionById(id) {
  const transaction = await Transaction.findById(id);
  if (!transaction) throw new NotFoundError('Transaction');
  return transaction;
}

async function addTransaction(payload) {
  if (!payload.type || !TYPES[payload.type]) {
    throw new ValidationError('type must be "income" or "expense"');
  }
  const amount = Number(payload.amount);
  if (Number.isNaN(amount) || amount < 0) {
    throw new ValidationError('amount must be a positive number');
  }
  const transaction = await Transaction.create({
    type: payload.type,
    category: payload.category || 'uncategorized',
    amount,
    date: payload.date || new Date().toISOString().slice(0, 10),
    userId: payload.userId || null,
  });
  return transaction;
}

async function updateTransaction(id, payload) {
  const transaction = await Transaction.findById(id);
  if (!transaction) throw new NotFoundError('Transaction');
  if (payload.type !== undefined) {
    if (!TYPES[payload.type]) throw new ValidationError('type must be "income" or "expense"');
    transaction.type = payload.type;
  }
  if (payload.category !== undefined) transaction.category = payload.category;
  if (payload.amount !== undefined) {
    const amount = Number(payload.amount);
    if (Number.isNaN(amount) || amount < 0) {
      throw new ValidationError('amount must be a positive number');
    }
    transaction.amount = amount;
  }
  if (payload.date !== undefined) transaction.date = payload.date;
  await transaction.save();
  return transaction;
}

async function deleteTransaction(id) {
  const transaction = await Transaction.findByIdAndDelete(id);
  if (!transaction) throw new NotFoundError('Transaction');
  return { deleted: true, id };
}

async function getSummary(userId = null) {
  const filter = userId ? { userId } : {};
  const transactions = await Transaction.find(filter).lean();

  let totalIncome = 0;
  let totalExpense = 0;
  const byCategory = { income: {}, expense: {} };

  for (const t of transactions) {
    const amount = Number(t.amount);
    if (t.type === 'income') {
      totalIncome += amount;
      byCategory.income[t.category] = (byCategory.income[t.category] || 0) + amount;
    } else {
      totalExpense += amount;
      byCategory.expense[t.category] = (byCategory.expense[t.category] || 0) + amount;
    }
  }

  const monthlyTrends = {};
  for (const t of transactions) {
    const month = t.date ? t.date.slice(0, 7) : new Date(t.createdAt).toISOString().slice(0, 7);
    if (!monthlyTrends[month]) monthlyTrends[month] = { income: 0, expense: 0 };
    monthlyTrends[month][t.type] += Number(t.amount);
  }

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    byCategory,
    monthlyTrends,
    transactionCount: transactions.length,
  };
}

module.exports = {
  getAllTransactions,
  getTransactionById,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  TYPES,
};
