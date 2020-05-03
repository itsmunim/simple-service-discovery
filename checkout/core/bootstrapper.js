const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');
const logger = require('./logger');
const state = require('../state');
const shutdownManager = require('./shutdown.manager');
const proxyHelper = require('./proxy.helper');

function bootstrap() {
  // define express app
  const app = express();
  app.use(bodyParser.json());
  state.initialize();

  return app;
}

function start(api) {
  const app = bootstrap();
  // attaching api
  app.use('/api', api);

  // api directory response
  app.get('/', (req, res) => {
    const response = {
      message: 'This is a simple checkout api service. Try hitting endpoints defined below.',
      endpoints: [
        {
          name: '/api/checkout/cart',
          description: 'Adds an item to cart. If item with same id existed, increments the count.',
          method: 'POST',
          body: '{id, name, price}'
        },
        {
          name: '/api/checkout/cart',
          description: 'Returns the current state of the cart.',
          method: 'GET'
        },
        {
          name: '/api/checkout/cart/remove',
          description: 'Removes an item from cart.',
          method: 'POST',
          body: '{id}'
        },
      ]
    }
    res.status(200).send(response);
  });

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