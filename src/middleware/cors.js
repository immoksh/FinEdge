const cors = require('cors');
const { nodeEnv } = require('../config/env');

const corsOptions = {
  origin: nodeEnv === 'production'
    ? process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) || []
    : true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

module.exports = cors(corsOptions);
