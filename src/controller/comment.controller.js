const catchAsync = require('../utils/catchAsync');
const { commentService } = require('../services');
const httpStatus = require('http-status'); // to add resposne status
const ApiError = require('../utils/apiError');

const addComment = catchAsync(async (req, res) => {
  const blog = await commentService.addComment(req.body.blogId, req.body.comment);
  if(blog){
    res.json({blog})
  }else{
        throw new ApiError(httpStatus.NOT_FOUND,'Blog not found');
  }
});

module.exports = {addComment}
