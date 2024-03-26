const httpStatus = require('http-status');
const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');
const userService = require('./user.service');
const ApiError = require('../utils/apiError');
const tokenService = require('./token.service');
const { tokenTypes } = require('../config/tokens');
const config = require('../config/config');
const { emailBruteLimiter } = require('../middleware/authLimiter');

const login = async (email, password, ipAddr) => {
  const rateLimiterOptions = {
    storeClient: mongoose.connection, // place to store the requests
    blockDuration: 60 * 60 * 24,
    dbName: 'blog_app',
  };
  const emailIpBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptions,
    points: config.rateLimiter.maxAttemptsByIpUsername,
    duration: 60 * 10,
  });
  const slowerBruteLimiter = new RateLimiterMongo({
    ...rateLimiterOptions,
    points: config.rateLimiter.maxAttemptsPerDay,
    duration: 60 * 60 * 24,
  });
  const promises = [slowerBruteLimiter.consume(ipAddr)];
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    user &&
      promises.push([
        emailIpBruteLimiter.consume(`${email}_${ipAddr}`),
        emailBruteLimiter.consume(email),
      ]);
    await Promise.all(promises);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const refreshAuthToken = async (refreshToken) => {
  const refreshTokenDoc = await tokenService.verifyToken(
    refreshToken,
    tokenTypes.REFRESH,
  );
  const user = await userService.getUserById(refreshTokenDoc.user);
  if (!user) {
    throw new Error();
  }
  await refreshTokenDoc.remove;
  return await tokenService.generateAuthTokens(user.id);
};
module.exports = {
  login,
  refreshAuthToken,
};
