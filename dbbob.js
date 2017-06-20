const fs = require('fs');
const pg = require('pg');
const console = require('console');

function DBBob(hostname, port, database) {
  this.hostname = hostname;
  this.port = port;
  this.database = database;
  this.schema = null;
  this.client = null;
}

DBBob.prototype.init = function init(schema) {
  const schemaUrl = (schema !== undefined && typeof schema === 'string') ? schema : 'schema.json';

  if (fs.existsSync(schemaUrl)) {
    this.schema = JSON.parse(fs.readFileSync(schemaUrl, 'utf8'));
  }
};

DBBob.prototype.getSchema = function getSchema() {
  console.log(this.schema);
};

DBBob.prototype.createTables = function createTables() {
  const connectionString = `postgres://${this.hostname}:${this.port}/${this.database}`;
  this.client = new pg.Client(connectionString);
  this.client.connect();

  const schema = this.schema;
  const client = this.client;
  const queryList = [];

  // First level of JSON are tables.
  Object.keys(schema).forEach((tableKey) => {
    // Second level of JSON is field definitions.
    const tableItems = Object.keys(schema[tableKey]).reduce((initial, fieldKey) => {
      // Check if key is a constrain.
      const fieldValue = schema[tableKey][fieldKey];
      if (fieldKey[0] === '#') {
        // If key has case, do special constrain line.
        // Otherwise throw exception.
        switch (fieldKey) {
          case '#autoincrement':
            initial.push(`${fieldValue} BIGSERIAL`);
            break;
          case '#primary_key':
            initial.push(`PRIMARY KEY (${fieldValue.join(', ')})`);
            break;
          default:
            throw new Error(`Contrain "${fieldKey}" defined, but it's not valid.`);
        }
      } else {
        initial.push(`${fieldKey} ${fieldValue}`);
      }
      return initial;
    }, []);

    queryList.push(`CREATE TABLE IF NOT EXISTS ${tableKey} (${tableItems.join(', ')})`);
  });

  // Execute all query lines.
  queryList.forEach((queryLine) => {
    console.log(queryLine);
    client.query(queryLine);
  });
};

DBBob.prototype.end = function end() {
  this.client.end();
};

module.exports = DBBob;
