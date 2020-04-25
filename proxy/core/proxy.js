const net = require('net');
const { createProxyMiddleware } = require('http-proxy-middleware');

const state = require('../state');
const config = require('./config');
const error = require('./error');

function verifyConnection(port, timeout) {
  return new Promise((resolve, reject) => {
    timeout = timeout || 10000; // default of 10 seconds

    function createTimeout(client) {
      return setTimeout(function () {
        resolve({ message: 'down' });
        client.end();
      }, timeout);
    }

    const client = net.createConnection({ port }, () => {
      resolve({ message: 'up' });
      client.end();
    });

    const timer = createTimeout(client);

    client.on('end', () => {
      clearTimeout(timer);
    });

    client.on('error', (err) => {
      resolve({ message: 'down', err });
    });
  });
}

// a conditional enablement of proxy middleware
function verify(fn) {
  return async function (req, res, next) {
    const { originalUrl } = req;

    if (originalUrl.startsWith('/p/')) {
      const service = /\/p\/([^/]+)/.exec(originalUrl)[1];

      const services = state.getAllServices();

      if (!services[service]) {
        const notFound = error.create('services-not-found', service);
        return res.status(notFound.status).send({ message: notFound.message });
      }

      if (services[service] && !originalUrl.endsWith('/')) {
        const trailingSlashNotPresent = error.create('trailing-slash-not-found', service);
        return res.status(trailingSlashNotPresent.status).send({ message: trailingSlashNotPresent.message });
      }

      const { message } = await verifyConnection(services[service]);

      if (message !== 'up') {
        return res.status(500).send({ message: 'Service might be down.' });
      }

      return fn(req, res, next);
    }

    next();
  }
}

// reloads proxy setup with server registries
function reload(app) {
  const services = state.getAllServices();
  const pathRewriteOptions = {};
  const routerTable = {};

  Object.keys(services).forEach((service) => {
    const port = services[service];
    pathRewriteOptions[`^/p/${service}/`] = '/';
    routerTable[`/p/${service}/`] = `http://127.0.0.1:${port}`;
  });

  const options = {
    target: `http://localhost:${config.port}`, // default url of this proxy service
    pathRewrite: pathRewriteOptions,
    router: routerTable,
  };

  // prefixing proxy urls with /p e.g. /p/service-1/api/users
  app.use(`/p`, verify(createProxyMiddleware(options)));
};

module.exports = {
  reload,
};