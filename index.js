const console = require('console');
const fs = require('fs');
const path = require('path');
const postgresqlDriver = require('./drivers/postgresql');
const mysqlDriver = require('./drivers/mysql');

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
 * @param {string} params.schemaUrl - JSON database schema URL.
 */
function DBBob(params) {
  this.client = null;
  this.hostname = params.hostname || null;
  this.port = params.port || null;
  this.database = params.database || null;
  this.schema = null;
  this.driver = null;
  this.user = params.user || null;
  this.password = params.password || null;

  // Schema file exists?
  const schemaUrl = params.schemaUrl || 'schema.json';
  if (fs.existsSync(schemaUrl)) {
    const schemaPath = path.resolve(__dirname, params.schemaUrl);
    const fileContent = fs.readFileSync(schemaPath, 'utf8');
    // Try to parse file content.
    try {
      this.schema = JSON.parse(fileContent);
    } catch (e) {
      throw new Error(`Error while parsing JSON file content:\n${e}`);
    }
  } else {
    throw new Error(`Schema file not found in ${params.schemaUrl}`);
  }

  // Set driver.
  switch (params.driver) {
    case 'postgresql':
      this.driver = postgresqlDriver;
      break;
    case 'mysql':
      this.driver = mysqlDriver;
      break;
    default:
      throw new Error(`Driver '${params.driver}' not found.`);
  }
}

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

  // Use of async/await for log.
  (async (driver, client) => {
    const amount = await driver.query(client, queryList, true);
    console.log(`${amount} create table queries executed.`);
  })(this.driver, this.client);
};

module.exports = DBBob;
