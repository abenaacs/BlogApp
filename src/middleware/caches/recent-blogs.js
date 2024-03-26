const logger = require('../../config/logger');
const redisCleint = require('../../config/redis');

module.exports = async (req, res, next) => {
   try {
    const key = 'recent-blogs'
    const cachedBlogs = await redisCleint.get(key);
    if(cachedBlogs){
        res.json(JSON.parse(cachedBlogs));
    } else{
        next();
    }
   } catch (error) {
    logger.error(error);
    next();
   }
}