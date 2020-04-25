const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');
const logger = require('./logger');
const shutdownManager = require('./shutdown.manager');
const proxyHelper = require('./proxy.helper');

function bootstrap() {
  // define express app
  const app = express();
  app.use(bodyParser.json());

  return app;
}

function start(api) {
  const app = bootstrap();
  // attaching api
  app.use('/api', api);

  const server = app.listen(config.port, async () => {
    logger.log(`server started successfully on port: ${config.port}`);
    // register with proxy service
    await proxyHelper.register();
  });

  shutdownManager.manage(server);
}

module.exports = {
  start,
};