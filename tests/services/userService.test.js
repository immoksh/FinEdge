const userService = require('../../src/services/userService');
const User = require('../../src/models/userModel');
const { connectDb, disconnectDb } = require('../../src/config/db');

beforeAll(async () => await connectDb());
afterAll(async () => await disconnectDb());

describe('userService', () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('registerUser', () => {
    it('throws ValidationError when email or password missing', async () => {
      await expect(userService.registerUser({})).rejects.toThrow(/required/i);
      await expect(userService.registerUser({ email: 'a@b.com' })).rejects.toThrow(/required/i);
    });

    it('throws ValidationError when email already exists', async () => {
      await User.create({ name: 'A', email: 'dup@test.com', password: 'p' });
      await expect(
        userService.registerUser({ email: 'dup@test.com', password: 'p2', name: 'B' })
      ).rejects.toThrow(/already exists/i);
    });

    it('creates user when valid', async () => {
      const user = await userService.registerUser({
        email: 'new@test.com',
        password: 'secret',
        name: 'New User',
      });
      expect(user._id).toBeDefined();
      expect(user.email).toBe('new@test.com');
      expect(user.name).toBe('New User');
    });
  });

  describe('findUserByEmail', () => {
    it('returns null when not found', async () => {
      const user = await userService.findUserByEmail('nonexistent@test.com');
      expect(user).toBeNull();
    });

    it('returns user when found', async () => {
      await User.create({ name: 'U', email: 'find@test.com', password: 'p' });
      const user = await userService.findUserByEmail('find@test.com');
      expect(user).toBeDefined();
      expect(user.email).toBe('find@test.com');
    });
  });

  describe('findUserById', () => {
    it('throws NotFoundError when not found', async () => {
      const mongoose = require('mongoose');
      const fakeId = new mongoose.Types.ObjectId();
      await expect(userService.findUserById(fakeId)).rejects.toThrow(/not found/i);
    });

    it('returns user when found', async () => {
      const created = await User.create({ name: 'U', email: 'id@test.com', password: 'p' });
      const user = await userService.findUserById(created._id);
      expect(user.email).toBe('id@test.com');
    });
  });

  describe('loginUser', () => {
    it('throws ValidationError when email or password missing', async () => {
      await expect(userService.loginUser({})).rejects.toThrow(/required/i);
    });

    it('throws UnauthorizedError when user not found', async () => {
      await expect(
        userService.loginUser({ email: 'no@test.com', password: 'any' })
      ).rejects.toThrow(/invalid/i);
    });
  });
});
