const pg = require('pg');

const Postgresql = {
  initClient: function initClient(hostname, port, database) {
    const connectionString = `postgres://${hostname}:${port}/${database}`;
    return new pg.Client(connectionString);
  },
  connect: function connect(client) {
    client.connect();
  },
  query: function query(client, queryList, disconnect = false) {
    let result = null;
    if (Array.isArray(queryList)) {
      result = client.query(queryList.join(';'));
    } else if (typeof queryList === 'string') {
      client.query(queryList);
    }
    if (disconnect) {
      result.on('end', () => { client.end(); });
    }
  },
  sqlColumn: function sqlColumn(columnName, columnType) {
    return `${columnName} ${columnType}`;
  },
  sqlCreateTable: function sqlCreateTable(tableName, tableItems) {
    const items = tableItems.join(', ');
    return `CREATE TABLE IF NOT EXISTS ${tableName} (${items})`;
  },
  constrainAutoincrement: function constrainAutoincrement(columnName) {
    return `${columnName} BIGSERIAL`;
  },
  constainPrimaryKey: function constainPrimaryKey(columnName) {
    return `PRIMARY KEY (${columnName.join(', ')})`;
  },
};

module.exports.postgresql = Postgresql;
