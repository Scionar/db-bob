const Meow = require("./meow.js");

let db = new Meow('localhost', '5432', 'kittens');
db.init();
db.createTables();
