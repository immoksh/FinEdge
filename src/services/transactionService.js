const Transaction = require('../models/transactionModel');
const { NotFoundError, ValidationError } = require('../errors');
const { TYPES } = Transaction;

async function getAllTransactions(userId = null) {
  const list = await Transaction.find({userId}).sort({ createdAt: -1 }).lean();
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

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    byCategory,
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
