const express = require('express');

const router = express.Router();
const { userValidation, authValidation } = require('../validation');
const { validate } = require('../middleware');
const { authController } = require('../controller');
const { authLimiter } = require('../middleware/authLimiter');

router.post(
  '/auth/register',
  validate(userValidation.createUserSchema),
  authController.register,
);
router.post(
  '/auth/login',
  authLimiter,
  validate(authValidation.loginSchema),
  authController.login,
);
router.post(
  '/auth/refresh-token',
  validate(authValidation.refreshTokenSchema),
  authController.refreshToken,
);

module.exports = router;
