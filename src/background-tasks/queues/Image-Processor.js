const {Queue} = require('bullmq');
const {config} = require('../../config')
const ImageProcessorQueue = new Queue('ImageProcessor', {
    connection:{
        host:config.redis.host,
        port: config.redis.port,
    }
});

module.exports = ImageProcessorQueue;