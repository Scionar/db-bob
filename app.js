const DBBob = require('./dbbob.js');

const db = new DBBob('postgresql', 'localhost', '5432', 'kittens');
db.init();
db.createTables();
