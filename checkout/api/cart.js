const router = require('express').Router({ mergeParams: true });

const state = require('../state');
const error = require('../core/error');


router.get('/cart', (req, res) => {
  res.status(200).send(state.getAllItems());
});

// example: {id: 'p-1', name: 'cool product', price: 123}
router.post('/cart', (req, res) => {
  const { id, name, price } = req.body;

  if (!id || !name || !price) {
    const badRequest = error.create('bad-request', 'id', 'name', 'price');
    return res.status(badRequest.status).send({ message: badRequest.message });
  }

  state.addToCart({ id, name, price });

  res.status(200).send(state.getAllItems());
});

// example: {id: 'p-1'} or {id: 'p-1', name: 'as', price: 1}
router.post('/cart/remove', (req, res) => {
  const { id } = req.body;

  if (!id) {
    const badRequest = error.create('bad-request', 'id');
    return res.status(badRequest.status).send({ message: badRequest.message });
  }

  state.removeFromCart({ id });

  res.status(200).send(state.getAllItems());
});

module.exports = router;