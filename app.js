const Meow = require("./meow.js");

let db = new Meow('localhost', '3322', 'kittens');
db.init();
db.getSchema();
