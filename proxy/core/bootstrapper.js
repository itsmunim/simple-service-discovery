const express = require('express');
const bodyParser = require('body-parser');

const proxy = require('./proxy');
const config = require('./config');
const logger = require('./logger');
const context = require('./context');
const state = require('../state');
const shutdownManager = require('./shutdown.manager');

function bootstrap() {
  // define express app
  const app = express();
  app.use(bodyParser.json());
  state.initialize();
  // reload the proxies
  proxy.reload(app);

  return app;
}

function start(api) {
  const app = bootstrap();
  // this injects app as a request context
  app.use(context.attach(app));
  // attaching api
  app.use('/api', api);

  // api directory response
  app.get('/', (req, res) => {
    const response = {
      message: 'This is a proxy api service. Try hitting endpoints defined below.',
      endpoints: [
        {
          name: '/api/services/register',
          description: 'Register a service.',
          method: 'POST',
          body: '{service, port}'
        },
        {
          name: '/api/services/deregister',
          description: 'De-register a service.',
          method: 'POST',
          body: '{service}'
        },
        {
          name: '/p/{service-name}/*',
          description: 'Hit the registered service paths.',
          method: 'GET'
        }
      ]
    }
    res.status(200).send(response);
  });

  const server = app.listen(config.port, () => {
    logger.log(`server started successfully on port: ${config.port}`);
  });

  shutdownManager.manage(server);
}

module.exports = {
  start,
};