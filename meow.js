const fs = require('fs');
const pg = require('pg');

function Meow(hostname, port, database) {
  this.hostname = hostname;
  this.port = port;
  this.database = database;
  this.schema = null;
  this.client = null;
}

Meow.prototype.init = function init(schema) {
  const schemaUrl = (schema !== undefined && typeof schema === 'string') ? schema : 'schema.json';

  if (fs.existsSync(schemaUrl)) {
    this.schema = JSON.parse(fs.readFileSync(schemaUrl, 'utf8'));
  }
};

Meow.prototype.getSchema = function getSchema() {
  console.log(this.schema);
};

Meow.prototype.createTables = function createTables() {
  const connectionString = `postgres://${this.hostname}:${this.port}/${this.database}`;
  this.client = new pg.Client(connectionString);
  this.client.connect();

  const schema = this.schema;
  const client = this.client;
  let query = null;

  const validContrains = [
    '#primary_key',
    '#autoincrement',
  ];

  // First level of JSON are tables.
  Object.keys(schema).forEach((tableKey) => {
    const tableItems = [];

    // Second level of JSON is field definitions.
    Object.keys(schema[tableKey]).forEach((fieldKey) => {
      // Check if key is a constrain.
      const fieldValue = schema[tableKey][fieldKey];
      if (fieldKey[0] === '#') {
        // If not valid contrain, pass iteration.
        if (validContrains.indexOf(fieldKey) < 0) { return; }
        switch (fieldKey) {
          case '#autoincrement':
            tableItems.push(`${fieldValue} BIGSERIAL`);
            break;
          case '#primary_key':
            tableItems.push(`PRIMARY KEY (${fieldValue.join(', ')})`);
            break;
          default:
        }
      } else {
        tableItems.push(`${fieldKey} ${fieldValue}`);
      }
    });

    const queryString = `CREATE TABLE IF NOT EXISTS ${tableKey} (${tableItems.join(', ')})`;
    console.log(queryString);
    query = client.query(queryString);
  });

  query.on('end', () => { client.end(); });
};

module.exports = Meow;
