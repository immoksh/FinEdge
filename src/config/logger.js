const winston = require('winston');

const { combine, timestamp, json, colorize, simple } = winston.format;

const transports = [
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'development'
      ? combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), simple())
      : combine(timestamp(), json()),
  }),
];

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    json()
  ),
  defaultMeta: { service: 'finedge' },
  transports,
});

module.exports = logger;
