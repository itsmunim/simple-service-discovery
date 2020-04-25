const router = require('express').Router({ mergeParams: true });

const serviceTableHelper = require('../core/service.table.helper');
const proxy = require('../core/proxy');
const error = require('../core/error');

// example: {service: 's-1', port: 8200}
router.post(`/register`, (req, res) => {
  const { service, port } = req.body;
  // injected by context middleware
  const { appContext } = req;

  if (!service || !port) {
    const badRequest = error.create('bad-request', 'server', 'port');
    return res.status(badRequest.status).send({ message: badRequest.message });
  }

  const serviceTable = serviceTableHelper.read();

  if (Object.values(serviceTable.services).includes(port)) {
    const portInUse = error.create('port-in-use', service);
    return res.status(portInUse.status).send({ message: portInUse.message });
  }

  serviceTable.services[service] = port;
  serviceTableHelper.write(serviceTable);

  // reload proxies
  proxy.reload(appContext.self);

  res.status(200).send(serviceTable);
});

router.post(`/deregister`, (req, res) => {
  const { service, port } = req.body;
  // injected by context middleware
  const { appContext } = req;

  if (!service || !port) {
    const badRequest = error.create('bad-request', 'server', 'port');
    return res.status(badRequest.status).send({ message: badRequest.message });
  }

  const serviceTable = serviceTableHelper.read();
  delete serviceTable[service];
  serviceTableHelper.write(serviceTable);

  // reload proxies
  proxy.reload(appContext.self);

  res.status(200).send(serviceTable);
});

module.exports = router;