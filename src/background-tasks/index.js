const ImageProcessorQueue = require('./queues/Image-Processor')
const CacheProcessorQueue = require('./queues/cache-processor')
const { startImageProcessor, startCacheProcessor } = require('./workers')

module.exports = {
    ImageProcessor:{
        Queue: ImageProcessorQueue,
        startWorker: startImageProcessor
    },
    CacheProcessor: {
        Queue: CacheProcessorQueue,
        startWorker:startCacheProcessor
    }
}