const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { config } = require('./index');
const { tokenTypes } = require('./tokens');
const { userService } = require('../services');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

// eslint-disable-next-line consistent-return
const jwtVerify = async (jwtPayload, done) => {
  try {
    if (jwtPayload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid Token Type');
    }
    const user = await userService.getUserById(jwtPayload.user);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    done(error, false);
  }
};
const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
