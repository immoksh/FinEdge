const express = require('express');
const transactionController = require('../controllers/transactionController');
const { requireAuth } = require('../middleware/auth');
const cacheMiddleware = require('../middleware/cache');

const router = express.Router();

router.use(requireAuth);
router.get('/', cacheMiddleware(60), transactionController.getSummary);

module.exports = router;
