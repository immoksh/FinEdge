require('dotenv').config();
const mongoose = require('mongoose');

const config = require('./env');

async function connectDb() {
  await mongoose.connect(config.mongoURI);
}

async function disconnectDb() {
  await mongoose.connection.close();
}

module.exports = {
  connectDb,
  disconnectDb,
};
