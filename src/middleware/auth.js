const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const { UnauthorizedError } = require('../errors');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authentication required. Provide a valid token.'));
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token.'));
  }
}

module.exports = {
  requireAuth,
};
