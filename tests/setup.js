const path = require('path');
const fs = require('fs');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

const uriPath = path.join(__dirname, '..', '.tmp', 'mongo-uri.txt');
if (fs.existsSync(uriPath)) {
  process.env.MONGODB_URI = fs.readFileSync(uriPath, 'utf-8').trim();
} else if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/finedge-test';
}
