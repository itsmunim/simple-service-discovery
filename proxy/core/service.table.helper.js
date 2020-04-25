const fs = require('fs');
const path = require('path');

const serviceTablePath = path.resolve(process.cwd(), 'proxy/data/service.table.json');

function read() {
  return JSON.parse(fs.readFileSync(serviceTablePath));
}

function write(serviceTable) {
  fs.writeFileSync(serviceTablePath, JSON.stringify(serviceTable, null, 2));
}

module.exports = {
  read,
  write,
};