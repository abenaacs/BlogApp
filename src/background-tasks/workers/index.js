const { Worker } = require('bullmq');
const path = require('path');
const { config } = require('../../config');
const logger = require('../../config/logger');

const createWorker = async (name, filename) => {
  const processorPath = path.join(__dirname, filename);
  const worker = new Worker(name, processorPath, {
    connection: {
      host: config.redis.host,
      port: config.redis.port,
    },
  });
  worker.on('completed', (job) =>
    logger.info(`${job.name} with ${job.id} is completed`),
  );
};

module.exports = createWorker;
