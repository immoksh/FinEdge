module.exports = async function globalTeardown() {
  if (global.__MONGOD_DEV__) {
    await global.__MONGOD_DEV__.stop();
  }
};
