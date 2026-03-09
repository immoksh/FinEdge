const logger = require('../config/logger');

function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl || req.url} ${res.statusCode} ${duration}ms`;
    logger.info(message, {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      durationMs: duration,
      ip: req.ip || req.socket?.remoteAddress,
      userAgent: req.get('user-agent') || undefined,
    });
  });
  next();
}

module.exports = requestLogger;
