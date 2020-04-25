const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const proxy = require('./proxy');
const config = require('./config');
const logger = require('./logger');
const context = require('./context');
const shutdownManager = require('./shutdown.manager');

function bootstrap() {
  // define express app
  const app = express();
  app.use(bodyParser.json());
  const dataPath = path.resolve(process.cwd(), 'proxy/data');

  if (fs.existsSync(dataPath)) {
    // add existing services to proxy while starting up
    proxy.load(app);
  } else {
    fs.mkdirSync(dataPath);
  }

  return app;
}

function start(api) {
  const app = bootstrap();
  // this injects app as a request context
  app.use(context.attach(app));
  // attaching api
  app.use('/api', api);

  const server = app.listen(config.port, () => {
    logger.log(`server started successfully on port: ${config.port}`);
  });

  shutdownManager.manage(server);
}

module.exports = {
  start,
};