const router = require('express').Router({ mergeParams: true });

const payment = require('./payment');

router.use('/payment', payment);

module.exports = router;