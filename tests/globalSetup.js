const path = require('path');
const fs = require('fs');

const dir = path.join(__dirname, '..', '.tmp');
fs.mkdirSync(dir, { recursive: true });
const uriPath = path.join(dir, 'mongo-uri.txt');

module.exports = async function globalSetup() {
  if (process.env.MONGODB_URI) {
    fs.writeFileSync(uriPath, process.env.MONGODB_URI);
    return;
  }
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    fs.writeFileSync(uriPath, uri);
    global.__MONGOD_DEV__ = mongod;
  } catch (err) {
    console.warn('MongoMemoryServer failed, using fallback URI. Set MONGODB_URI for a real DB.');
    fs.writeFileSync(uriPath, 'mongodb://localhost:27017/finedge-test');
  }
};
