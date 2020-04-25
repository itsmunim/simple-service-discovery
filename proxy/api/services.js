const router = require('express').Router({ mergeParams: true });

const serviceTableHelper = require('../core/service.table.helper');
const proxy = require('../core/proxy');
const error = require('../core/error');

router.post(`/register`, (req, res) => {
  const { service, port } = req.body;
  // injected by context middleware
  const { appContext } = req;

  if (!service || !port) {
    const badRequest = error.create('bad-request', 'server', 'port');
    return res.status(badRequest.status).send({ message: badRequest.message });
  }

  const serviceTable = serviceTableHelper.read();
  serviceTable.services[service] = port;
  serviceTableHelper.write(serviceTable);

  // add proxy middlware by passing in the current app
  proxy.add(appContext.self, service, port);

  res.status(200).send(serviceTable);
});

router.post(`/deregister`, (req, res) => {
  const { service, port } = req.body;

  if (!service || !port) {
    const badRequest = error.create('bad-request', 'server', 'port');
    return res.status(badRequest.status).send({ message: badRequest.message });
  }

  const serviceTable = serviceTableHelper.read();
  delete serviceTable[service];
  serviceTableHelper.write(serviceTable);

  res.status(200).send(serviceTable);
});

module.exports = router;