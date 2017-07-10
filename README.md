# DB Bob

DB Bob is relation SQL database builder and validator. Database structure is configured with easy JSON structure. Support has been build for MySQL and PostgreSQL. This project is ideal to use with task runner.

## How to run
```javascript
const DBBob = require('./dbbob.js');

const db = new DBBob({
  driver: 'postgresql',
  hostname: 'localhost',
  port: '5432',
  database: 'exampledb',
  user: 'username',
  password: 'p4ssword'
  schemaUrl: 'schema.json'
});
db.createTables();
```

DBBob instance takes six parameters: driver, host, port number, database name, username, password and schemaUrl. Driver can be 'postgresql' or 'mysql'. SchemaUrl parameter is relative path to schema file. Default schemaUrl is `schema.json`.

CreateTables method reads JSON structure and creates database structure.

## Structure of schema

JSON should be 2 dimensional structure. First dimension names are table names. Every table has object as value. This object's name/value pairs are column names and their types. Name can be also special contrain, which starts with # character. Example `#primary_key` which defines primary key.

```json
{
  "account" : {
    "#autoincrement" : "uid",
    "username": "text",
    "firstname": "text",
    "lastname": "text",
    "created": "date",
    "#primary_key" : ["uid"]
  },
  "posts" : {
    "id" : "integer",
    "content" : "text"
  }
}
```

In example above we have:
- Two tables named account and posts.
- Post table has only two columns, id and content. id column's type is integer and content's text.
- Account table has four columns defined. Username, firstname, lastname and created.
- Account table has two contrains defined. In these cases uid column is created with an auto increment type. uid column is also made as primary key of table.

### Special contrains

- **autoincrement**

  Creates column with auto incrementing serial number. Special contrain is used because serial number is made different ways in different SQL software. (Example PostgreSQL vs. MySQL)

- **primary_key**

  Defines primary key. Value is an array be cause there can be multiple columns used for primary key. PostgreSQL creates primary key *tablename_pkey*.
