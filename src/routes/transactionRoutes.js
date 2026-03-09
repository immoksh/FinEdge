const express = require('express');
const transactionController = require('../controllers/transactionController');
const validateTransaction = require('../middleware/validator');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);


router.post('/', validateTransaction, transactionController.addTransaction);
router.get('/', transactionController.getAllTransactions);
router.get('/:id', transactionController.getTransactionById);
router.patch('/:id', validateTransaction, transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
