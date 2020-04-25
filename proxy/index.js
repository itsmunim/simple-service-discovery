const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const { createProxyMiddleware } = require('http-proxy-middleware');

const basePath = '/api/services';
const serviceTablePath = path.resolve(process.cwd(), 'proxy/data/service.table.json');

function getBadRequestError(...params) {
  return {
    status: 400,
    message: `One of the params from: ${params.join(', ')} is missing.`
  };
}

function readServiceTable() {
  return JSON.parse(fs.readFileSync(serviceTablePath));
}

function writeServiceTable(serviceTable) {
  fs.writeFileSync(serviceTablePath, JSON.stringify(serviceTable, null, 2));
}

// a conditional enablement of proxy middleware
function enableVerified(fn) {
  return function (req, res, next) {
    const { originalUrl } = req;
    if (originalUrl.startsWith('/p/')) {
      const service = /\/p\/([^/]+)/.exec(originalUrl)[1];
      const serviceTable = readServiceTable();
      if (serviceTable.services[service]) {
        fn(req, res, next);
      } else {
        return res.status(404).send({ message: 'Service not found.' });
      }
    } else {
      return res.status(404).send({ message: 'URL does not exist.' });
    }
  }
}

// defines the proxy middleware for a registered service
function defineProxy(app, service, port) {
  const pathRewriteOptions = {};
  pathRewriteOptions[`^/p/${service}/`] = '/';

  const options = {
    target: `http://localhost:${port}`,
    ws: true,
    pathRewrite: pathRewriteOptions
  };

  app.use(`/p/${service}`, enableVerified(createProxyMiddleware(options)));
};

// defines proxy for existing ones at startup
function defineProxyFromExisting(app) {
  const serviceTable = readServiceTable();
  Object.keys(serviceTable.services).forEach((service) => {
    defineProxy(app, service, serviceTable.services[service]);
  });
}

// define express app
const app = express();
app.use(bodyParser.json());

/* APIs */

// registers a service
app.post(`${basePath}/register`, (req, res) => {
  const { service, port } = req.body;

  if (!service || !port) {
    const error = getBadRequestError('server', 'port');
    return res.status(error.status).send({ message: error.message });
  }

  const serviceTable = readServiceTable();
  serviceTable.services[service] = port;
  writeServiceTable(serviceTable);

  // start proxy middlware
  defineProxy(app, service, port);

  res.status(200).send(serviceTable);
});

// deregisters a service
app.post(`${basePath}/deregister`, (req, res) => {
  const { service, port } = req.body;

  if (!service || !port) {
    const error = getBadRequestError('server', 'port');
    return res.status(error.status).send({ message: error.message });
  }

  const serviceTable = readServiceTable();
  delete serviceTable[service];
  writeServiceTable(serviceTable);

  res.status(200).send(serviceTable);
});

// add existing services to proxy
defineProxyFromExisting(app);

app.listen(9020, () => {
  console.log('Proxy service started in 9020 port');
})