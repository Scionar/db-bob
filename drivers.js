const pg = require('pg');

const Postgresql = {
  initClient: function initClient(hostname, port, database) {
    const connectionString = `postgres://${hostname}:${port}/${database}`;
    return new pg.Client(connectionString);
  },
  connect: function connect(client) {
    client.connect();
  },
  sqlColumn: function sqlColumn(columnName, columnType) {
    return `${columnName} ${columnType}`;
  },
  sqlCreateTable: function sqlCreateTable(tableName, tableItems) {
    const items = tableItems.join(', ');
    return `CREATE TABLE IF NOT EXISTS ${tableName} (${items})`;
  },
};

module.exports.postgresql = Postgresql;
