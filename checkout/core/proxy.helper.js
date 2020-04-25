const axios = require('axios');

const config = require('./config');
const logger = require('./logger');

const baseUrl = `${config.proxyUrl}/api/services`;

async function register() {
  await axios.post(`${baseUrl}/register`, {
    service: config.name,
    port: config.port,
  });
  logger.log(`successfully registered with proxy.`);
}

async function deregister() {
  await axios.post(`${baseUrl}/deregister`, {
    service: config.name,
  });
  logger.log(`successfully deregistered from proxy.`);
}

module.exports = {
  register,
  deregister,
};

