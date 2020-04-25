const router = require('express').Router({ mergeParams: true });

const services = require('./services');

router.use('/services', services);

module.exports = router;