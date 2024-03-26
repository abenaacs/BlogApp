const httpStatus = require('http-status');
const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');
const ApiError = require('../utils/apiError');
const { config } = require('../config');

const rateLimiterOptions = {
  storeClient: mongoose.connection, // place to store the requests
  blockDuration: 60 * 60 * 24,
  dbName: 'blog_app',
};
const emailIpBruteLimiter = new RateLimiterMongo({
  ...rateLimiterOptions,
  points: config.rateLimiter.maxAttemptsPerEmail,
  duration: 60 * 10,
});
const slowerBruteLimiter = new RateLimiterMongo({
  ...rateLimiterOptions,
  points: config.rateLimiter.maxAttemptsPerDay,
  duration: 60 * 60 * 24,
});
const emailBruteLimiter = new RateLimiterMongo({
  ...rateLimiterOptions,
  points: config.rateLimiter.maxAttemptsPerEmail,
  duration: 60 * 60 * 24,
});
// eslint-disable-next-line consistent-return
const authLimiter = async (req, res, next) => {
  const ipaddr = req.connection.remoteAddress;
  const emailIpKey = `${req.body.email}_${ipaddr}`;
  const [slowerBruteRes, emailIpRes, emailBruteRes] = await Promise.all([
    slowerBruteLimiter.get(ipaddr),
    emailIpBruteLimiter.get(emailIpKey),
    emailBruteLimiter.get(req.body.email),
  ]);
  let retrySeconds = 0;
  if (
    slowerBruteRes &&
    slowerBruteRes.consumedPoints >= config.rateLimiter.maxAttemptsPerDay
  ) {
    retrySeconds = Math.floor(slowerBruteRes.msBeforeNext / 1000) || 1;
  } else if (
    emailIpRes &&
    emailIpRes.consumedPoints >= config.rateLimiter.maxAttemptsByIpUsername
  ) {
    retrySeconds = Math.floor(emailIpRes.msBeforeNext / 1000) || 1;
  } else if (
    emailBruteRes &&
    emailBruteRes.consumedPoints >= config.rateLimiter.maxAttemptsPerEmail
  ) {
    retrySeconds = Math.floor(emailIpRes.msBeforeNext / 1000) || 1;
  }

  if (retrySeconds > 0) {
    res.set('Retry-After', String(retrySeconds));
    return next(
      new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Too many requests'),
    );
  }
  next();
};

module.exports = {
  emailIpBruteLimiter,
  slowerBruteLimiter,
  emailBruteLimiter,
  authLimiter,
};
