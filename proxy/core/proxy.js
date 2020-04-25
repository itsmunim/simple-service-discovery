const { createProxyMiddleware } = require('http-proxy-middleware');

const serviceTableHelper = require('./service.table.helper');
const error = require('./error');

// a conditional enablement of proxy middleware
function verify(fn) {
  return function (req, res, next) {
    const { originalUrl } = req;

    if (originalUrl.startsWith('/p/')) {
      const service = /\/p\/([^/]+)/.exec(originalUrl)[1];
      const serviceTable = readServiceTable();

      if (serviceTable.services[service]) {
        return fn(req, res, next);
      } else {
        const notFound = error.create('services-not-found', service);
        return res.status(notFound.status).send({ message: notFound.message });
      }
    }

    next();
  }
}

function add(app, service, port) {
  const pathRewriteOptions = {};
  pathRewriteOptions[`^/p/${service}/`] = '/';

  const options = {
    target: `http://localhost:${port}`,
    ws: true,
    pathRewrite: pathRewriteOptions
  };

  app.use(`/p/${service}`, verify(createProxyMiddleware(options)));
};

function load(app) {
  const serviceTable = serviceTableHelper.read();
  Object.keys(serviceTable.services).forEach((service) => {
    add(app, service, serviceTable.services[service]);
  });
}

module.exports = {
  add,
  load,
};