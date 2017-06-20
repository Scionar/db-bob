const DBBob = require('./dbbob.js');

const db = new DBBob('localhost', '5432', 'kittens');
db.init();
db.createTables();
db.end();
