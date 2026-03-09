const express = require('express');
const mountRoutes = require('./routes');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cors = require('./middleware/cors');
const rateLimiter = require('./middleware/rateLimiter');
const logger = require('./config/logger');
const mongoose = require('mongoose');

const app = express();

app.use(cors);
app.use(express.json());
app.use(rateLimiter);
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

mountRoutes(app);

app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI).then(() => {
  logger.info('MongoDB connected');
  app.listen(process.env.PORT, () => {
    logger.info(`FinEdge server running at http://localhost:${process.env.PORT}`);
    logger.info(`Health: GET http://localhost:${process.env.PORT}/health`);
  });
}).catch((err) => {
  logger.error('MongoDB connection error', { error: err.message, stack: err.stack });
});


module.exports = app;
