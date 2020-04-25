const router = require('express').Router({ mergeParams: true });

const state = require('../state');
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

  try {
    state.addService(service, port);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
  // reload proxies
  proxy.reload(appContext.self);

  res.status(200).send(state.getAllServices());
});

router.post(`/deregister`, (req, res) => {
  const { service } = req.body;
  // injected by context middleware
  const { appContext } = req;

  if (!service) {
    const badRequest = error.create('bad-request', 'server');
    return res.status(badRequest.status).send({ message: badRequest.message });
  }

  state.removeService(service);
  // reload proxies
  proxy.reload(appContext.self);

  res.status(200).send(state.getAllServices());
});

module.exports = router;