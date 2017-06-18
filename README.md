# DB Bob

DB Bob is relation SQL database builder and validator. Database structure is configured with easy JSON structure. First support is coming for PostgreSQL and idea is also to unify database building. This project is ideal to use with task runner.

## How to run
```javascript
const DBBob = require('./dbbob.js');

const db = new DBBob('localhost', '5432', 'exampledb');
db.init('schema.json');
db.createTables();
```

DBBob instance takes three parameters: host, port number and database name. Init method takes name schema file url. default this is `schema.json` which searches schema.json from repository root.

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
