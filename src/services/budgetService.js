const Budget = require('../models/budgetModel');
const { NotFoundError, ValidationError } = require('../errors');

async function createOrUpdateBudget(userId, payload) {
    const { month, year, monthlyGoal, savingsTarget } = payload;

    if (!month || !year || monthlyGoal === undefined || savingsTarget === undefined) {
        throw new ValidationError('month, year, monthlyGoal, and savingsTarget are required');
    }

    const budget = await Budget.findOneAndUpdate(
        { userId, month, year },
        { monthlyGoal, savingsTarget, updatedAt: Date.now() },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return budget;
}

async function getBudget(userId, month, year) {
    if (!month || !year) {
        throw new ValidationError('month and year query parameters are required');
    }
    const budget = await Budget.findOne({ userId, month, year });
    if (!budget) {
        return { userId, month, year, monthlyGoal: 0, savingsTarget: 0 };
    }
    return budget;
}

module.exports = {
    createOrUpdateBudget,
    getBudget,
};
