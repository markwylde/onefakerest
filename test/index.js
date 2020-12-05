const http = require('http');

const test = require('basictap');
const axios = require('axios');
const onefakerest = require('../');
const faker = require('faker');

test('server works', async t => {
  t.plan(2);

  faker.seed(1);
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

  server.close();

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

test('server works - with pagination', async t => {
  t.plan(2);

  faker.seed(1);
  const fakerest = onefakerest({
    pagination: {
      limit: 5
    },
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
        records: 20,
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

  const response = await axios('http://localhost:8000/notes');

  server.close();

  t.equal(response.data.length, 5, 'had the correct amount of records');
  t.deepEqual(response.data,
    [{
      id: '3b452acd-600c-49fa-b447-c31177e14e41',
      userId: '7862f3cc-bfc5-41b8-aded-1d0420ea196a',
      subject: 'Magni cupiditate sit vitae soluta.',
      content: 'Voluptates ut ullam quos. Illo error sunt laborum ratione a officia. Cumque incidunt aut provident esse. Eligendi quos esse ut ab voluptas sed quae nam eos. Autem rerum doloremque officia aut ut ut. Ducimus eos saepe consequatur.\n' +
        ' \rUt dolorem et molestiae ea ut. Placeat quidem est consequuntur aut est fuga. Placeat ex ut voluptas enim ex eveniet facere. Aut delectus aut nam et dolorum.'
    },
    {
      id: '1cf1759f-663c-4ec9-80c9-25980eb57ec9',
      userId: '6fbe024f-2316-4265-a6e8-d65a837e308a',
      subject: 'Totam perferendis ut non fugiat.',
      content: 'Repellat quasi ipsum rem eos quod recusandae. Optio laudantium et incidunt. Molestias facere quia et ab quo occaecati quia ipsum. Qui accusantium odit. Molestias dolore aut.\n' +
        ' \rUt incidunt omnis delectus voluptas. Quia ut minima sunt qui. Ut quam natus consequatur sit vel et. Ut porro aut laborum iure. Et facere placeat molestiae iste molestiae. Commodi inventore sequi quia.'
    },
    {
      id: '0e1c39b0-8a02-414f-9943-142b23f95f0d',
      userId: '7862f3cc-bfc5-41b8-aded-1d0420ea196a',
      subject: 'Quod labore ullam quos sed.',
      content: 'Eum saepe nesciunt omnis sit et quasi eaque corrupti vel. Omnis similique blanditiis voluptatem provident doloribus aut. Ratione vel molestias omnis numquam maxime sint. Laudantium voluptatem magni et voluptas quis non et. Non explicabo facere.\n' +
        ' \rEx quaerat explicabo. Qui adipisci non rerum in cupiditate voluptas molestiae fuga. Quia et qui id cupiditate.'
    },
    {
      id: 'be2ea063-b9cf-46fe-83e0-ae64729087ec',
      userId: '7862f3cc-bfc5-41b8-aded-1d0420ea196a',
      subject: 'Sint consequatur qui est sapiente.',
      content: 'Ex consequuntur beatae dolores. Quas perferendis voluptatem praesentium hic sapiente dolorem suscipit. Rem quia odit.\n' +
        ' \rMagni rerum consequatur sed nisi veniam earum. Culpa eveniet debitis et nulla. Et delectus praesentium. Unde ut quibusdam in quis consequuntur.'
    },
    {
      id: 'f950f936-3cd5-43ed-9823-c9900060a6e9',
      userId: '6fbe024f-2316-4265-a6e8-d65a837e308a',
      subject: 'Alias accusamus reiciendis repellendus autem.',
      content: 'Vitae id nesciunt eum non in esse et ut quis. Officia optio placeat architecto vero eaque possimus temporibus. Ut et consequatur quia voluptatem tempore totam qui. Eum labore velit voluptatem in.\n' +
        ' \rMagni dolorum natus et dolorem. Quam cum nobis velit ad molestiae aut nisi eius quibusdam. Aut recusandae et. Nam sint enim sit magnam ullam at ut non. Et amet sunt vitae minus quae occaecati dignissimos assumenda.'
    }]
  );
});
