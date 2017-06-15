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

  Object.keys(schema).forEach((tableKey) => {
    let queryString = `CREATE TABLE IF NOT EXISTS ${tableKey} (`;

    Object.keys(schema[tableKey]).forEach((fieldKey, fieldIndex) => {
      let fieldQuery = `${fieldKey} ${schema[tableKey][fieldKey]}`;

      // Do not add comma after last item.
      if (fieldIndex < (Object.keys(schema[tableKey]).length - 1)) {
        fieldQuery += ', ';
      }
      queryString += fieldQuery;
    });

    queryString += ')';
    console.log(queryString);
    query = client.query(queryString);
  });

  query.on('end', () => { client.end(); });
};

module.exports = Meow;
