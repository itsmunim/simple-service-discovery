const config = require('./config');
const debug = require('debug')(config.name);

module.exports = {
  log: debug,
};