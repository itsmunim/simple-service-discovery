const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(process.cwd(), 'proxy/data');
const filePath = `${dataDir}/service.table.json`;

function create() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ items: {} }, null, 2));
  }
}

function read() {
  return JSON.parse(fs.readFileSync(filePath));
}

function write(serviceTable) {
  fs.writeFileSync(filePath, JSON.stringify(serviceTable, null, 2));
}

module.exports = {
  create,
  read,
  write,
};