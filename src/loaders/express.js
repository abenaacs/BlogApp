const express = require('express');

const httpStatus = require('http-status');
const passport = require('passport');
const { xss } = require('express-xss-sanitizer');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const { blogRouter, authRouter, commentRouter } = require('../routes');
const { error } = require('../middleware');
const ApiError = require('../utils/apiError');
const { morgan } = require('../config');
const { cspOptions, env } = require('../config/config');
const { jwtStrategy } = require('../config/passport');

module.exports = async (app) => {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
  app.use(express.json());

  // jwt authentication
  app.use(passport.initialize());
  passport.use('jwt', jwtStrategy);

  // security
  app.use(xss());
  app.use(
    helmet({
      contentSecurityPolicy: cspOptions,
    }),
  );
  app.use(mongoSanitize());

  if (env === 'production') {
    app.use(cors({ origin: 'url' }));
    app.options('*', cors({ origin: 'url' }));
  } else {
    // enabling all cors
    app.use(cors());
    app.options('*', cors());
  }

  app.use(authRouter);
  app.use(blogRouter);
  app.use(commentRouter);

  // Page Not Found
  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, '"not found'));
  });
  app.use(error.errorConverter);
  app.use(error.errorHandler);
  return app;
};
