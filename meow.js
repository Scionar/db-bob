const fs = require('fs');

function Meow(hostname, port, database) {
  this.hostname = hostname;
  this.port = port;
  this.database = database;
  this.schema = null;
}

Meow.prototype.init = function(schema) {
  let schema_url = (schema !== undefined && typeof schema === 'string' ) ? schema : 'schema.json';

  if (fs.existsSync(schema_url)) {
    this.schema = JSON.parse(fs.readFileSync(schema_url, 'utf8'));
  }
}

Meow.prototype.getSchema = function() {
  console.log(this.schema);
}

Meow.prototype.createTables = function() {
  
}

module.exports = Meow;
