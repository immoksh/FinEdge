const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { NotFoundError, ValidationError, UnauthorizedError } = require('../errors');

async function getAllUsers() {
  return User.find().lean();
}

async function findUserById(id) {
  const user = await User.findById(id);
  if (!user) throw new NotFoundError('User');
  return user;
}

async function findUserByEmail(email) {
  return User.findOne({ email: email?.toLowerCase() });
}

async function registerUser({ email, password, name }) {
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new ValidationError('User with this email already exists');
  }
  const user = { email, password, name: name || '' };
  user.email = email.toLowerCase().trim();
  user.name = (name || '').trim();
  user.password = await bcrypt.hash(password, 10);
  const newUser = await User.create(user);
  return newUser;
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }
  const user = await findUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new UnauthorizedError('Invalid email or password');
  }
  return user;
}

module.exports = {
  getAllUsers,
  findUserById,
  findUserByEmail,
  registerUser,
  loginUser,
};
