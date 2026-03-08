const express = require('express');
const mountRoutes = require('./routes');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');

const app = express();

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

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
        console.log(`FinEdge server running at http://localhost:${process.env.PORT}`);
        console.log(`Health: GET http://localhost:${process.env.PORT}/health`);
    });
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});


module.exports = app;
