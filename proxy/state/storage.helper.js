const fs = require('fs');
const path = require('path');

const serviceTablePath = path.resolve(process.cwd(), 'proxy/data/service.table.json');

function create() {
  if (!fs.existsSync(serviceTablePath)) {
    fs.writeFileSync(serviceTablePath, JSON.stringify({ services: {} }, null, 2));
  }
}

function read() {
  return JSON.parse(fs.readFileSync(serviceTablePath));
}

function write(serviceTable) {
  fs.writeFileSync(serviceTablePath, JSON.stringify(serviceTable, null, 2));
}

module.exports = {
  create,
  read,
  write,
};