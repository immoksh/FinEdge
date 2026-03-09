const userRoutes = require('./userRoutes');
const transactionRoutes = require('./transactionRoutes');

function mountRoutes(app) {
  app.use('/users', userRoutes);
  app.use('/transactions', transactionRoutes);
  app.use('/summary', require('./summaryRoutes'));
  app.use('/budgets', require('./budgetRoutes'));
}

module.exports = mountRoutes;
