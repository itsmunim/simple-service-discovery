const proxy = require('express-http-proxy');

const state = require('../state');
const logger = require('./logger');

function reload(app) {
  const services = state.getAllServices();
  Object.keys(services).forEach((service) => {
    const port = services[service];
    const proxyUrl = `/p/${service}`;
    logger.log(`adding proxy rule for: ${proxyUrl}`);
    app.use(proxyUrl, proxy(`localhost:${port}`));
  });
}

module.exports = {
  reload,
};