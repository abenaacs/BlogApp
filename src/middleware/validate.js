const joi = require("joi");
const ApiError = require("../utils/apiError");
const logger = require('../config/logger')
const validate = (schema) => (req, res, next) => {
  const keys = Object.keys(schema);
  const object = keys.reduce((obj, key) => {
    if (Object.prototype.hasOwnProperty.call(req, key)) {
      obj[key] = req[key];
    }
    return obj;
  }, {});
  const { value, error } = joi.compile(schema).validate(object);
 logger.info(object);
  if (error) {
    const errors = error.details.map((detail) =>detail.message).join(',');
    next(new ApiError(400, errors));
    // next({statusCode: 400, message: errors})
  }
  return next();
};

module.exports = validate;
