const mysql = require('mysql');

module.exports = {
  initClient: function initClient(params) {
    return mysql.createConnection({
      host: params.hostname || null,
      port: params.port || null,
      user: params.user || null,
      password: params.password || null,
      database: params.database || null,
    });
  },
  connect: function connect(client) {
    client.connect();
  },
  query: function query(client, queryList, disconnect = false) {
    let result = null;
    const queries = [].concat(queryList);
    queries.forEach((sqlLine) => {
      result = client.query(sqlLine, (e) => {
        if (e) throw new Error(`Error in query execute:\n${e}`);
      });
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
    return `${columnName} MEDIUMINT NOT NULL AUTO_INCREMENT`;
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
