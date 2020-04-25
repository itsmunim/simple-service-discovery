const storageHelper = require('./storage.helper');
const logger = require('../core/logger');

const cart = {
  items: {}
};

function initialize() {
  storageHelper.create();
  syncWithStorage();
}

function addToCart(item) {
  logger.log(`adding item with id: ${item.id}`);

  if (cart.items[item.id]) {
    cart.items[item.id].count++;
  } else {
    item.count = 1;
    cart.items[item.id] = item;
  }

  // keep the state written
  storageHelper.write(cart);
}

function removeFromCart(item) {
  logger.log(`removing item with id: ${item.id}`);

  delete cart.items[item.id];
  // keep the state written
  storageHelper.write(cart);
}

function getAllItems() {
  return cart.items;
}

function syncWithStorage() {
  cart.items = storageHelper.read().items;
}

module.exports = {
  initialize,
  addToCart,
  removeFromCart,
  getAllItems,
  syncWithStorage,
};