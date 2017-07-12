const assert = require('assert');
const DBBob = require('..');

const constructorParams = {
  driver: 'postgresql',
  hostname: 'localhost',
  port: '5432',
  database: 'example',
  user: 'username',
  password: 'password',
  schemaUrl: 'schema.json.example',
}

describe('DBBob', function () {
  describe('constructor', function () {
    it('should be object', function () {
      const bob = new DBBob(constructorParams);
      assert.ok(typeof bob === 'object');
    });

    it('has right properties', function () {
      const bob = new DBBob(constructorParams);
      assert.equal(bob.hostname, constructorParams.hostname);
      assert.equal(bob.port, constructorParams.port);
      assert.equal(bob.database, constructorParams.database);
      assert.equal(bob.user, constructorParams.user);
      assert.equal(bob.password, constructorParams.password);
    });
  });
});
