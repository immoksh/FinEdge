const express = require('express');
const budgetController = require('../controllers/budgetController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.post('/', budgetController.setBudget);
router.get('/', budgetController.getBudget);

module.exports = router;
