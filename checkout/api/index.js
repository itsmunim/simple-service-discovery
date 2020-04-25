const router = require('express').Router({ mergeParams: true });

const cart = require('./cart');

router.use('/checkout', cart);

module.exports = router;