const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 10000 : (Number(process.env.RATE_LIMIT_MAX) || 100),
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
