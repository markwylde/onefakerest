const http = require('http');

const test = require('basictap');
const axios = require('axios');
const onefakerest = require('../');
const faker = require('faker');
faker.seed(1);

test('server works', async t => {
  t.plan(2);

  const fakerest = onefakerest({
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

  const server = http.createServer(fakerest);
  server.listen(8000);

  const response = await axios('http://localhost:8000/users');

  t.equal(response.data.length, 2, 'had the correct amount of records');
  t.deepEqual(response.data,
    [
      {
        firstName: 'Tatyana',
        id: '6fbe024f-2316-4265-a6e8-d65a837e308a',
        lastName: 'Johnson',
        noteCount: 5
      },
      {
        firstName: 'Vernie',
        id: '7862f3cc-bfc5-41b8-aded-1d0420ea196a',
        lastName: 'Jenkins',
        noteCount: 5
      }
    ]);
});
