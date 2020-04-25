const router = require('express').Router({ mergeParams: true });

// accepts cart object from checkout service
router.post('/pay', (req, res) => {
  const cart = req.body;
  const totalPayment = Object.keys(cart).reduce((sum, key) => {
    sum += cart[key].price;
    return sum;
  }, 0);
  res.status(200).send({
    message: `Successfully paid ${totalPayment}`
  });
});

module.exports = router;