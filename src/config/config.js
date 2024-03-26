require('dotenv').config();
const { envValidation } = require('../validation');

const { value: envVars, error } = envValidation.validate(process.env);
const logger = require('./logger');

if (error) {
  logger.error(error);
}

module.exports = {
  port: envVars.PORT,
  dbConnection: envVars.DB_CONNECTION,
  env: envVars.NODE_ENV,
  jwt: {
    secret: envVars.JWT_SECRET_KEY,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
  rateLimiter: {
    maxAttemptsPerDay: envVars.MAX_ATTEMPTS_PER_DAY,
    maxAttemptsPerEmail: envVars.MAX_ATTEMPTS_PER_EMAIL,
    maxAttemptsByIpUsername: envVars.MAX_ATTEMPTS_BY_IP_USERNAME,
  },
  cspOptions: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
    },
    reportOnly: true,
  },
  authEmail: {
    user: envVars.AUTH_EMAIL,
    pass: envVars.AUTH_EMAIL_PASSWORD,
  },
  redis:{
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
  }
};
