require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const config = {
  jwtSecret: process.env.JWT_SECRET || 'fallback-dev-secret-do-not-use-in-prod',
  adminPath: process.env.ADMIN_PATH || '/eqwahXxcihIhMfcK',
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtExpiresIn: '2h',
  bcryptRounds: 12,
  uploadMaxSize: 5 * 1024 * 1024, // 5MB
};

module.exports = config;
