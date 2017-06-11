const fs = require('fs');
const pg = require('pg');

function Meow(hostname, port, database) {
  this.hostname = hostname;
  this.port = port;
  this.database = database;
  this.schema = null;
  this.client = null;
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
  //let connectionString = 'postgres://' + this.hostname + ':' + this.port + '/' + this.database;
  //this.client = new pg.Client(connectionString);
  //this.client.connect();

  let schema = this.schema;
  Object.keys(schema).map(function(tableKey) {
    let queryString = 'CREATE TABLE ' + tableKey + '(';

    Object.keys(schema[tableKey]).map(function(fieldKey, fieldIndex) {
      let fieldQuery = fieldKey + ' ' + schema[tableKey][fieldKey];

      // Do not add comma after last item.
      if (fieldIndex < (Object.keys(schema[tableKey]).length - 1)) {
        fieldQuery += ', ';
      }
      queryString += fieldQuery;
    });

    queryString += ')'
    console.log(queryString);
  });

  //let queryString = 'CREATE TABLE ';
  //let createDatabase = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
  //query.on('end', () => { client.end(); });
}

module.exports = Meow;
