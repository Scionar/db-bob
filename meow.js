function Meow(hostname, port, database) {
  this.hostname = hostname;
  this.port = port;
  this.database = database;
}

Meow.prototype.init = function() {
  console.log(this.hostname + ':' + this.port + '/' + this.database);
}

module.exports = Meow;
