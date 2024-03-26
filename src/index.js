const http = require('http');
const express = require('express');
const {config} = require('./config');
const logger = require('./config/logger');
const loaders = require('./loaders');

const exitHandler = (server) => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unExpectedErrorHandler = (server) => {
  return function (error) {
    logger.error(error);
    exitHandler(server);
  };
};

const startServer = async () => {
  const app = express();
  await loaders(app);

  const httpServer = http.createServer(app);
  const server = httpServer.listen(config.port, () => {
    logger.info(`Server is listening on port ${config.port}`);
  });

  process.on('uncaughtException', unExpectedErrorHandler(server));
  process.on('unhandledRejection', unExpectedErrorHandler(server));
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
};

startServer();
