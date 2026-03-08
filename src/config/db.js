require('dotenv').config();
const mongoose = require('mongoose');

async function connectDb() {
  await mongoose.connect(process.env.MONGODB_URI);
}

async function disconnectDb() {
  await mongoose.connection.close();
}

module.exports = {
  connectDb,
  disconnectDb,
};
