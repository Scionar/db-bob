const pg = require('pg');

module.exports = {
  initClient: function initClient(params) {
    const connectionString = {
      user: params.user || null,
      database: params.database || null,
      password: params.password || null,
      host: params.hostname || null,
      port: params.port || null,
    };
    return new pg.Client(connectionString);
  },
  connect: function connect(client) {
    client.connect();
  },
  query: function query(client, queryList, disconnect = false) {
    let result = null;
    const queries = [].concat(queryList);
    result = client.query(queries.join(';'), (e) => {
      if (e) throw new Error(`Error in query execute:\n${e}`);
    });
    if (disconnect) {
      result.on('end', () => { client.end(); });
    }
    return queries.length;
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
  constainReference: function constainPrimaryKey(refValue) {
    if (typeof refValue.column !== 'undefined') {
      return `FOREIGN KEY (${refValue.key}) REFERENCES ${refValue.table} (${refValue.column})`;
    }
    return `FOREIGN KEY (${refValue.key}) REFERENCES ${refValue.table}`;
  },
};
