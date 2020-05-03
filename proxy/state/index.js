const storageHelper = require('./storage.helper');

const serviceTable = {
  services: {}
};

function initialize() {
  storageHelper.create();
  syncWithStorage();
}

function addService(service, port) {
  if (Object.values(serviceTable.services).includes(port)) {
    throw new Error(`Port: ${port}  already registered`);
  }

  serviceTable.services[service] = port;
  // keep the state written
  storageHelper.write(serviceTable);
}

function removeService(service) {
  delete serviceTable.services[service];
  // keep the state written
  storageHelper.write(serviceTable);
}

function getAllServices() {
  return serviceTable.services;
}

function syncWithStorage() {
  serviceTable.services = storageHelper.read().services || {};
}

module.exports = {
  initialize,
  addService,
  removeService,
  getAllServices,
  syncWithStorage,
};