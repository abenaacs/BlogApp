const httpStatus = require("http-status");
const ApiError = require("../utils/apiError");
const passport = require("passport");
const verifyCallback =(
    req,
    resolve,
    reject,
  ) =>
  async (err, user, info) => {
   if(err){
    return reject(new Error(err));
   } else if(info){
    return reject(new ApiError(httpStatus.UNAUTHORIZED, info.message));
   } else if(!user){
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'User Not Found'));
   }
   req.user = user //saving the user
    resolve();
  };

const auth = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      'jwt',
      { session: false},
      verifyCallback(req, resolve, reject),
    )(req, res, next);
  })
    .then(() => next())
    .catch((error) => next(error));
};

module.exports = auth;
