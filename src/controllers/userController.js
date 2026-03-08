const userService = require('../services/userService');
const { jwtSecret } = require('../config/env');
const jwt = require('jsonwebtoken');

async function register(req, res, next) {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({
      user,
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const user = await userService.loginUser(req.body);
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '3h' }
    );
    res.status(200).json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
};
