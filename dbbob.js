const fs = require('fs');
const driverSupport = require('./drivers');
const console = require('console');

function DBBob(driverName, hostname, port, database, user, password) {
  this.hostname = hostname;
  this.port = port;
  this.database = database;
  this.schema = null;
  this.client = null;
  this.driver = driverSupport[driverName];
  this.user = user;
  this.password = password;
}

DBBob.prototype.init = function init(schema) {
  const schemaUrl = (schema !== undefined && typeof schema === 'string') ? schema : 'schema.json';

  if (fs.existsSync(schemaUrl)) {
    this.schema = JSON.parse(fs.readFileSync(schemaUrl, 'utf8'));
  }
};

DBBob.prototype.createTables = function createTables() {
  this.client = this.driver.initClient(this.hostname, this.port, this.database, this.user, this.password);
  this.driver.connect(this.client);

  const schema = this.schema;
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
            initial.push(this.driver.constrainAutoincrement(fieldValue));
            break;
          case '#primary_key':
            initial.push(this.driver.constainPrimaryKey(fieldValue));
            break;
          default:
            throw new Error(`Contrain "${fieldKey}" defined, but it's not valid.`);
        }
      } else {
        initial.push(this.driver.sqlColumn(fieldKey, fieldValue));
      }
      return initial;
    }, []);

    queryList.push(this.driver.sqlCreateTable(tableKey, tableItems));
  });

  // Execute all query lines.
  this.driver.query(this.client, queryList, true);
};

module.exports = DBBob;
