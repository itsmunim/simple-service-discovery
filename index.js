const axios = require('axios');
const log = require('debug')('simulator');

const proxyUrl = 'http://127.0.0.1:9020/p';

const serviceNameMap = {
  checkout: 'checkout-service',
  payment: 'payment-service',
};

function getServiceUrl(serviceName, path) {
  return `${proxyUrl}/${serviceNameMap[serviceName]}/${path}`;
}

async function simulate() {
  log('starting the orchestration simulation');

  const cartUrl = getServiceUrl('checkout', 'api/checkout/cart');
  const paymentUrl = getServiceUrl('payment', 'api/payment/pay');

  log('adding an item with id 123 into cart');
  let response = await axios.post(cartUrl, {
    id: 123,
    name: 'item-1',
    price: 2
  });
  log(response.data);

  log('adding another item with id 124 into cart');
  response = await axios.post(cartUrl, {
    id: 124,
    name: 'item-2',
    price: 123
  });
  log(response.data);

  log('getting current cart state');
  response = await axios.get(cartUrl);
  log(response.data);

  log('doing payment for the items');
  response = await axios.post(paymentUrl, response.data);
  log('done payment', response.data);

  log('finishing the simulation');
}

simulate();