const userRoutes = require('./userRoutes');
const transactionRoutes = require('./transactionRoutes');

function mountRoutes(app) {
  app.use('/api/v1/user', userRoutes);
  app.use('/api/v1/transaction', transactionRoutes);
}

module.exports = mountRoutes;
