const errorHandler = require('../../src/middleware/errorHandler');

describe('middleware/errorHandler', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('sends statusCode and message from error', () => {
    const err = new Error('Bad request');
    err.statusCode = 400;
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Bad request',
      })
    );
  });

  it('defaults to 500 and Internal Server Error', () => {
    errorHandler(new Error(), req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Internal Server Error',
      })
    );
  });
});
