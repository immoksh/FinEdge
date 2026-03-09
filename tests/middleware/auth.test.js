const jwt = require('jsonwebtoken');
const { optionalAuth, requireAuth } = require('../../src/middleware/auth');
const { jwtSecret } = require('../../src/config/env');

describe('middleware/auth', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {};
    next = jest.fn();
  });

  describe('optionalAuth', () => {
    it('calls next() when no Authorization header', () => {
      optionalAuth(req, res, next);
      expect(next).toHaveBeenCalledWith();
      expect(req.user).toBeUndefined();
    });

    it('sets req.user when valid token', () => {
      const token = jwt.sign({ userId: '123', email: 'a@b.com' }, jwtSecret);
      req.headers.authorization = `Bearer ${token}`;
      optionalAuth(req, res, next);
      expect(next).toHaveBeenCalledWith();
      expect(req.user).toEqual({ userId: '123', email: 'a@b.com' });
    });

    it('calls next() without setting user when token invalid', () => {
      req.headers.authorization = 'Bearer invalid-token';
      optionalAuth(req, res, next);
      expect(next).toHaveBeenCalledWith();
      expect(req.user).toBeUndefined();
    });
  });

  describe('requireAuth', () => {
    it('calls next(UnauthorizedError) when no token', () => {
      requireAuth(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].statusCode).toBe(401);
    });

    it('sets req.user and calls next() when valid token', () => {
      const token = jwt.sign({ userId: '456', email: 'x@y.com' }, jwtSecret);
      req.headers.authorization = `Bearer ${token}`;
      requireAuth(req, res, next);
      expect(next).toHaveBeenCalledWith();
      expect(req.user).toEqual({ userId: '456', email: 'x@y.com' });
    });
  });
});
