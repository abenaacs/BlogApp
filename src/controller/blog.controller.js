const catchAsync = require('../utils/catchAsync');
const { blogService } = require('../services');
const httpStatus = require('http-status'); // to add resposne status
const ApiError = require('../utils/apiError');
const {ImageProcessor} = require('../background-tasks');
const workers = require('../background-tasks/workers');

const createBlog = catchAsync(async (req, res) => {
  await blogService.createBlog(req.body, req.user.id);
  res
    .status(httpStatus.CREATED)
    .send({ success: true, message: 'blog created' });
});

const getBlogs = catchAsync(async (req, res) => {
  const blogs = await blogService.getBlogs(req.body.userId);
  res.status(httpStatus.OK).json(blogs);
});

const getRecentBlogs = catchAsync(async (req, res) => {
  const blogs = await blogService.getRecentBlogs();
  res.status(httpStatus.OK).json(blogs);
});

const searchBlogs = catchAsync(async(req, res) => {
  const {searchQuery} = req.query;
  const blogs = await blogService.searchBlogs(searchQuery);
  res.json({blogs});
})

const uploadFile = catchAsync(async (req, res) => {
  if(!req.file){
    throw new ApiError(httpStatus.NOT_FOUND, 'File not Found');
  }
  const fileName = `image-${Date.now()}.webp`;
  await ImageProcessor.Queue.add('ImageProcessor',{
    file: req.file,
    fileName,
  });
  res.status(httpStatus.OK).json({fileName});
});

const getFile = catchAsync(async (req, res) => {
  const {filename} = req.params; 
  const stream = await blogService.getReadableFileStream(req.params.filename);
  const contentType = `image/${filename.split('.')[1].toLowerCase()}`;
  res.setHeader('Create-Type', contentType);
  stream.pipe(res);
});
module.exports = {
  createBlog,
  getBlogs,
  getRecentBlogs,
  searchBlogs,
  uploadFile,
  getFile,
};
