const http = require('http');

const test = require('basictap');
const axios = require('axios');
const onefakerest = require('../');
const faker = require('faker');

test('server works', async t => {
  t.plan(1);

  const fakerest = onefakerest({
    data: {
      users: {
        records: 10,
        properties: {
          id: () => faker.uuid(),
          firstName: () => faker.firstName(),
          lastName: () => faker.lastName()
        }
      },
      notes: {
        records: 100,
        properties: {
          id: () => faker.uuid(),
          userId: () => faker.random.arrayElement(fakerest.data.users).id,
          subject: () => faker.lorem.paragraphs(1),
          content: () => faker.lorem.paragraphs(3)
        }
      }
    }
  });

  const server = http.createServer(fakerest);
  server.listen(8000);

  const response = await axios('http://localhost:8000/users');

  t.deepEqual(response.data, { a: 1 });
});
