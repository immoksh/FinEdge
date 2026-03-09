require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-default-key-for-dev',
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/finedge'
};
