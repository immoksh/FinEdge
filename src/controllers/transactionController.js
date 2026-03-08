const transactionService = require('../services/transactionService');

async function addTransaction(req, res, next) {
  try {
    const payload = { ...req.body, userId: req.user?.userId ?? null };
    const transaction = await transactionService.addTransaction(payload);
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
}

async function getAllTransactions(req, res, next) {
  try {
    const userId = req.user?.userId ?? null;
    const transactions = await transactionService.getAllTransactions(userId);
    res.json(transactions);
  } catch (err) {
    next(err);
  }
}

async function getTransactionById(req, res, next) {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    res.json(transaction);
  } catch (err) {
    next(err);
  }
}

async function updateTransaction(req, res, next) {
  try {
    const transaction = await transactionService.updateTransaction(req.params.id, req.body);
    res.json(transaction);
  } catch (err) {
    next(err);
  }
}

async function deleteTransaction(req, res, next) {
  try {
    const result = await transactionService.deleteTransaction(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getSummary(req, res, next) {
  try {
    const userId = req.user?.userId ?? null;
    const summary = await transactionService.getSummary(userId);
    res.json(summary);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getSummary,
};
