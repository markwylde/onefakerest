# onefakerest
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/markwylde/onefakerest?style=flat-square)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/markwylde/onefakerest?style=flat-square)](https://github.com/markwylde/onefakerest/blob/master/package.json)
[![GitHub](https://img.shields.io/github/license/markwylde/onefakerest?style=flat-square)](https://github.com/markwylde/onefakerest/blob/master/LICENSE)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/standard/semistandard)

A library for NodeJS that allows you to accumulate a load of changes, then run a function
after a set amount of time with those changes.

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
      records: 10,
      generator: () => ({
        id: faker.uuid(),
        firstName: faker.firstName(),
        lastName: faker.lastName()
      })
    },
    notes: {
      records: 100,
      generator: () => ({
        id: faker.uuid(),
        userId: faker.random.arrayElement(fakerest.data.users).id,
        subject: faker.lorem.paragraphs(1),
        content: faker.lorem.paragraphs(3)
      })
    }
  }
}

const server = http.createServer(handler);
server.on('listening', function () {
  console.log(`listening on port ${server.address().port}`);
});
server.listen(8000);
```
