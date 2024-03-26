const { Blog } = require('./../models');
const mongoose = require('mongoose');
const fs = require('fs');
const ApiError = require('../utils/apiError');
const httpStatus = require('http-status');
const { CacheProcessor } = require('../background-tasks');
const redisClient = require('../');
const createBlog = async (body, userId) => {
  await Blog.create({ ...body, createdBy: userId });
  await redisClient.del('recent-blogs');
};
const getBlogs = async (userId) => {
  const blogs = await Blog.find({ createdBy: userId });
  return blogs;
};

const getRecentBlogs = async () => {
  const blogs = await Blog.find()
    .sort({
      createdAt: -1,
    })
    .limit(10)
    // .lean();
  await CacheProcessor.Queue.add('CacheJob', { blogs });
  return blogs;
};

const searchBlogs = async (searchQuery) =>{
  const blogs = await Blog.find({ $text: {$search: searchQuery } });
  return blogs;
}

const getReadableFileStream = async (filename) => {
  const filePath = `${__dirname}/../../uploads/${filename}`;
  if (!fs.existsSync(filePath)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not Found');
  }
  const stream = fs.createReadStream(filePath);
  return stream;
};

module.exports = {
  createBlog,
  getBlogs,
  getRecentBlogs,
  searchBlogs,
  getReadableFileStream,
};
