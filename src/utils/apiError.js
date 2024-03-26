class ApiError extends Error {
  constructor(statusCode, message, isOperationl = true, stack = '') {
    super(message);
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
    this.statusCode = statusCode;
    this.isOperationl = isOperationl;
  }
}

module.exports = ApiError;
