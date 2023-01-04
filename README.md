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

## Demo
Run the demo server by running:
```bash
npm run start
```

Then visiting:
- http://localhost:8000/users?page=1&limit=10
- http://localhost:8000/notes?page=1&limit=10

## Usage
```javascript
import http from 'http';
import { faker } from '@faker-js/faker';
import onefakerest from './index.js';

const handler = onefakerest({
  pagination: { // pagination is optional. it's absence will return all records.
    limit: 5
  },

  data: {
    users: {
      records: 2,
      generator () {
        return {
          id: faker.datatype.uuid(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          noteCount: 0
        };
      }
    },

    notes: {
      records: 10,
      generator ({ users }) {
        const user = faker.helpers.arrayElement(users);
        user.noteCount += 1;

        return {
          id: faker.datatype.uuid(),
          userId: user.id,
          subject: faker.lorem.sentence(5),
          content: faker.lorem.paragraphs(2)
        };
      }
    }
  }
});

const server = http.createServer(handler);
server.on('listening', () => {
  console.log(`listening on port ${server.address().port}`);
  // http://localhost:8000/notes?page=1&limit=10
});
server.listen(8000);
```
