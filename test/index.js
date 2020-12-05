const http = require('http');

const test = require('basictap');
const axios = require('axios');
const onefakerest = require('../');
const faker = require('faker');

faker.seed(1);

const data = {
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
};

test('server works', async t => {
  t.plan(2);

  faker.seed(1);
  const fakerest = onefakerest({
    data
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
        noteCount: 11
      },
      {
        firstName: 'Vernie',
        id: '7862f3cc-bfc5-41b8-aded-1d0420ea196a',
        lastName: 'Jenkins',
        noteCount: 9
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
    data
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

test('server works - with pagination - page 2', async t => {
  t.plan(2);

  faker.seed(1);
  const fakerest = onefakerest({
    pagination: {
      limit: 5
    },
    data
  });

  const server = http.createServer(fakerest);
  server.listen(8000);

  const response = await axios('http://localhost:8000/notes?page=2');

  server.close();

  t.equal(response.data.length, 5, 'had the correct amount of records');
  t.deepEqual(response.data,
    [{
      id: '917c5a1c-6b13-4f02-8cdd-1ba92287e573',
      userId: '6fbe024f-2316-4265-a6e8-d65a837e308a',
      subject: 'Nulla deserunt quo enim eos.',
      content: 'Voluptates totam quaerat eius aut odio adipisci. Et sit qui aut quia quas. Tempore at illo esse. Et id ut voluptatem. Necessitatibus sint temporibus. Eius sequi velit dolorum soluta perspiciatis.\n' +
        ' \rExcepturi qui doloribus facere ratione modi ab occaecati. Repellendus porro voluptatem enim quia reprehenderit officiis vitae nulla aliquid. Alias et fuga hic velit dolorem fuga.'
    },
    {
      id: '510abbc9-6cb0-49cf-b445-43aa5cc879c0',
      userId: '7862f3cc-bfc5-41b8-aded-1d0420ea196a',
      subject: 'Doloribus ducimus ullam ut qui.',
      content: 'Omnis ut velit aut delectus quidem sed asperiores asperiores perspiciatis. Non consequatur dolores praesentium ex rerum accusantium provident. In maxime sint doloremque. Consequatur est eos aut eligendi.\n' +
        ' \rCorrupti amet voluptas dignissimos iste culpa enim doloribus. Sed ad dolore tempora voluptatem est. Et blanditiis velit inventore aut molestias laudantium non est. Corporis ullam corrupti accusantium sed deserunt sunt nulla dolorem.'
    },
    {
      id: '8bc8e83f-bc40-49b2-b5f1-384b17651da0',
      userId: '6fbe024f-2316-4265-a6e8-d65a837e308a',
      subject: 'Et iure optio praesentium voluptas.',
      content: 'Voluptates nulla minima molestiae illum. Expedita fuga aut qui id beatae id sit soluta. Qui praesentium sunt. Ea accusantium a. Maiores qui iure maxime quo qui voluptatibus qui qui.\n' +
        ' \rVoluptatum dicta et doloribus ea dolor et asperiores. Et est eaque. Quisquam dolorum est aut. Ut odit alias minima hic omnis et.'
    },
    {
      id: 'c8eb2129-3d9b-4e8f-9bbb-4ef693a271ed',
      userId: '7862f3cc-bfc5-41b8-aded-1d0420ea196a',
      subject: 'Officiis ratione pariatur voluptatem est.',
      content: 'Enim veniam voluptatibus doloribus ut et provident. Ipsam est voluptates quia consequatur et et. Excepturi tempora itaque. Doloremque nemo porro atque necessitatibus est accusantium qui occaecati. Voluptas rerum eos rerum natus. Est ut qui aut et dolores nostrum.\n' +
        ' \rSaepe in sed. Qui sint quo sint cupiditate. Neque dolore hic quis inventore recusandae. Itaque in nulla vel et rerum tempora consequuntur dicta voluptate.'
    },
    {
      id: '5522d916-fd22-47b2-be97-560430a27c82',
      userId: '6fbe024f-2316-4265-a6e8-d65a837e308a',
      subject: 'Quia qui sunt non repellat.',
      content: 'Qui deserunt sequi reiciendis corporis ut voluptas mollitia et. Quo explicabo adipisci. Quasi qui aut.\n' +
        ' \rAut id dolorem tenetur aut. Assumenda adipisci dolorem dolorem harum fuga. Inventore voluptatum voluptas perferendis voluptatibus aliquid est quos. Qui qui totam odio.'
    }]
  );
});
