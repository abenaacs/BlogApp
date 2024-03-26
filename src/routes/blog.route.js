const express = require('express');
const upload = require('../utils/multer');
const router = express.Router();
const { blogValidation } = require('../validation');
const { validate } = require('../middleware');
const { blogController } = require('../controller');
const auth = require('../middleware/auth');
const getRecentBlogsCache =  require('../middleware/caches/recent-blogs')

router.get(
  '/blogs',
  auth,
  validate(blogValidation.getBlogSchema),
  blogController.getBlogs,
);
router.get('/recent-blogs',getRecentBlogsCache ,blogController.getRecentBlogs);

router.get('/blog/search', auth, blogController.searchBlogs)
router.post(
  '/blog',
  auth,
  validate(blogValidation.createBlogSchema),
  blogController.createBlog,
);

router.post(
  '/blog/cover-image',
  auth,
  upload.single('coverImage'),
  blogController.uploadFile,
);
router.get('/blog/image/:filename', auth, blogController.getFile);
module.exports = router;
