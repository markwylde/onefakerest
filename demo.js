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
