const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/apiError');
const EventEmitter = require('../utils/EventEmitter');

const createUser = async (userBody) => {
  // check email exists
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken');
  }
  const user = await User.create(userBody);
  // send Email
  EventEmitter.emit('signup', user);
  return user;
};
const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};
const getUserById = async (id) => {
  const user = await User.findOne({ id });
  return user;
};
const getUser = async () => {
  const users = await User.find({});
  return users;
};
module.exports = {
  createUser,
  getUser,
  getUserByEmail,
  getUserById,
};
