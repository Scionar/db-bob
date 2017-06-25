const DBBob = require('./dbbob.js');

const db = new DBBob('mysql', 'localhost', '3306', 'kittens', 'root', 'root');
db.init();
db.createTables();
