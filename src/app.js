const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mountRoutes = require('./routes');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');
const config = require('./config/env');
const app = express();

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use(limiter);

app.use(express.json());
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

if (require.main === module) {
  mongoose.connect(config.mongoURI).then(() => {
    console.log('MongoDB connected');
    app.listen(config.port, () => {
      console.log(`FinEdge server running at http://localhost:${config.port}`);
      console.log(`Health: GET http://localhost:${config.port}/health`);
    });
  }).catch((err) => {
    console.error('MongoDB connection error:', err);
  });
}

module.exports = app;
