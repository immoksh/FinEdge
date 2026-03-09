const mongoose = require('mongoose');
const User = require('../../src/models/userModel');
const { connectDb, disconnectDb } = require('../../src/config/db');

beforeAll(async () => await connectDb());
afterAll(async () => await disconnectDb());

describe('User model', () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  it('creates a user with required fields', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'secret123',
    });
    expect(user._id).toBeDefined();
    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@example.com');
    expect(user.password).toBe('secret123');
    expect(user.role).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });

  it('requires name, email, password', async () => {
    await expect(User.create({})).rejects.toThrow();
    await expect(User.create({ email: 'a@b.com', password: 'p' })).rejects.toThrow();
    await expect(User.create({ name: 'A', password: 'p' })).rejects.toThrow();
    await expect(User.create({ name: 'A', email: 'a@b.com' })).rejects.toThrow();
  });

  it('enforces unique email', async () => {
    await User.create({ name: 'A', email: 'same@example.com', password: 'p' });
    await expect(
      User.create({ name: 'B', email: 'same@example.com', password: 'p2' })
    ).rejects.toThrow();
  });
});
