const budgetService = require('../services/budgetService');

async function setBudget(req, res, next) {
    try {
        const userId = req.user.userId;
        const budget = await budgetService.createOrUpdateBudget(userId, req.body);
        res.status(200).json(budget);
    } catch (err) {
        next(err);
    }
}

async function getBudget(req, res, next) {
    try {
        const userId = req.user.userId;
        const month = Number(req.query.month);
        const year = Number(req.query.year);
        const budget = await budgetService.getBudget(userId, month, year);
        res.status(200).json(budget);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    setBudget,
    getBudget,
};
