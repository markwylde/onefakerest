# onefakerest
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/markwylde/onefakerest?style=flat-square)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/markwylde/onefakerest?style=flat-square)](https://github.com/markwylde/onefakerest/blob/master/package.json)
[![GitHub](https://img.shields.io/github/license/markwylde/onefakerest?style=flat-square)](https://github.com/markwylde/onefakerest/blob/master/LICENSE)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/standard/semistandard)

An http handler for NodeJS that sets up a fake rest endpoint.

## Installation
```bash
npm install --save onefakerest
```

## Usage
```javascript
const http = require('http');
const onefakerest = require('onefakerest');
const faker = require('faker');

const handler = onefakerest({
  data: {
    users: {
      records: 2,
      generator: function () {
        return {
          id: faker.random.uuid(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          noteCount: 0
        };
      }
    },

    notes: {
      records: 10,
      generator: function ({ users }) {
        const user = faker.random.arrayElement(users);
        user.noteCount = user.noteCount + 1;

        return {
          id: faker.random.uuid(),
          userId: user.id,
          subject: faker.lorem.sentence(5),
          content: faker.lorem.paragraphs(2)
        };
      }
    }
  }
});

const server = http.createServer(handler);
server.on('listening', function () {
  console.log(`listening on port ${server.address().port}`);
  // http://localhost:8000/notes
});
server.listen(8000);
```
