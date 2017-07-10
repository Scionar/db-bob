const pg = require('pg');
const mysql = require('mysql');

module.exports.postgresql = {
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

module.exports.mysql = {
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
    if (Array.isArray(queryList)) {
      queryList.forEach((sqlLine) => {
        result = client.query(sqlLine);
      });
    } else if (typeof queryList === 'string') {
      result = client.query(queryList);
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
    return `${columnName} MEDIUMINT NOT NULL AUTO_INCREMENT`;
  },
  constainPrimaryKey: function constainPrimaryKey(columnName) {
    return `PRIMARY KEY (${columnName.join(', ')})`;
  },
};
