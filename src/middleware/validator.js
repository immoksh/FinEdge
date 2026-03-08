const { TYPES } = require('../models/transactionModel');
const { ValidationError } = require('../errors');

function validateTransactionInput(req, res, next) {
  const { body } = req;
  const isPost = req.method === 'POST';
  const isPatch = req.method === 'PATCH';

  if (isPost) {
    if (!body.type || !TYPES[body.type]) {
      return next(new ValidationError('type is required and must be "income" or "expense"'));
    }
    const amount = Number(body.amount);
    if (body.amount == null || Number.isNaN(amount) || amount < 0) {
      return next(new ValidationError('amount is required and must be a positive number'));
    }
  }

  if (isPatch && Object.keys(body).length === 0) {
    return next(new ValidationError('At least one field (type, category, amount, date) is required'));
  }

  if (isPatch && body.type !== undefined && !TYPES[body.type]) {
    return next(new ValidationError('type must be "income" or "expense"'));
  }

  if ((isPost || isPatch) && body.amount !== undefined) {
    const amount = Number(body.amount);
    if (Number.isNaN(amount) || amount < 0) {
      return next(new ValidationError('amount must be a positive number'));
    }
  }

  next();
}

module.exports = validateTransactionInput;
