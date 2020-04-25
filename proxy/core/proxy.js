const { createProxyMiddleware } = require('http-proxy-middleware');

const serviceTableHelper = require('./service.table.helper');
const config = require('./config');
const error = require('./error');

// a conditional enablement of proxy middleware
function verify(serviceTable, fn) {
  return function (req, res, next) {
    const { originalUrl } = req;

    if (originalUrl.startsWith('/p/')) {
      const service = /\/p\/([^/]+)/.exec(originalUrl)[1];

      if (!serviceTable.services[service]) {
        const notFound = error.create('services-not-found', service);
        return res.status(notFound.status).send({ message: notFound.message });
      }

      if (serviceTable.services[service] && !originalUrl.endsWith('/')) {
        const trailingSlashNotPresent = error.create('trailing-slash-not-found', service);
        return res.status(trailingSlashNotPresent.status).send({ message: trailingSlashNotPresent.message });
      }

      return fn(req, res, next);
    }

    next();
  }
}

// reloads proxy setup with server registries
function reload(app) {
  const serviceTable = serviceTableHelper.read();
  const pathRewriteOptions = {};
  const routerTable = {};

  Object.keys(serviceTable.services).forEach((service) => {
    const port = serviceTable.services[service];
    pathRewriteOptions[`^/p/${service}/`] = '/';
    routerTable[`/p/${service}/`] = `http://localhost:${port}`;
  });

  const options = {
    target: `http://localhost:${config.port}`, // default url of this proxy service
    pathRewrite: pathRewriteOptions,
    router: routerTable,
  };

  // prefixing proxy urls with /p e.g. /p/service-1/api/users
  app.use(`/p`, verify(serviceTable, createProxyMiddleware(options)));
};

module.exports = {
  reload,
};