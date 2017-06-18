const Meow = require('./meow.js');

const db = new Meow('localhost', '5432', 'kittens');
db.init();
db.createTables();
