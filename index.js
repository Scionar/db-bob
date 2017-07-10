const fs = require('fs');
const driverSupport = require('./drivers');

/**
 * Creates DB Bob instance.
 * @class
 * @param {Object} params - Parameter object
 * @param {string} params.hostname - Database server hostname.
 * @param {string} params.port - Database server port.
 * @param {string} params.database - Database name in server.
 * @param {string} params.driver - Database server driver.
 * @param {string} params.user - Database server username.
 * @param {string} params.password - Database server user password.
 * @param {string} [params.schema] - JSON database schema.
 */
function DBBob(params) {
  this.client = null;
  this.hostname = params.hostname || null;
  this.port = params.port || null;
  this.database = params.database || null;
  this.schema = params.schema || 'schema.json';
  this.driver = params.driverName ? driverSupport[params.driverName] : null;
  this.user = params.user || null;
  this.password = params.password || null;
}

DBBob.prototype.init = function init(schema) {
  const schemaUrl = (schema !== undefined && typeof schema === 'string') ? schema : 'schema.json';

  if (fs.existsSync(schemaUrl)) {
    this.schema = JSON.parse(fs.readFileSync(schemaUrl, 'utf8'));
  }
};

DBBob.prototype.createTables = function createTables() {
  this.client = this.driver.initClient({
    hostname: this.hostname,
    port: this.port,
    database: this.database,
    user: this.user,
    password: this.password,
  });
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
