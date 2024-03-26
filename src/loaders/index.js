const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const logger = require('../config/logger');
const subscribers = require('../subscribers');
const EventEmitter = require('../utils/EventEmitter')
const fs = require('fs');
const redisClient = require('../config/redis');
const createWorker = require('../background-tasks/workers');
module.exports = async (app) => {
  await mongooseLoader();
  logger.info('Mongoose initiated.');
  await redisClient.connect();
  logger.info('Redis connected.');
  await expressLoader(app);
  logger.info('Express initiated.');
  Object.keys(subscribers).forEach((eventName) =>{
    EventEmitter.on(eventName, subscribers[eventName])
  });

  fs.access('uploads',fs.constants.F_OK, async (err)=>{
    if(err){
      await fs.promises.mkdir('uploads')
    }
  });

  const workers = [
    {name: 'ImagePRocessor', filename: 'image-processor.js'},
    {name: 'Cache', filename: 'cache-processor.js'},
  ];

  workers.forEach(async (worker) => {
    await createWorker(worker.name, worker.filename);
  })
};
