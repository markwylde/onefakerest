import http from 'http';
import test from 'basictap';
import axios from 'axios';
import {
  faker
} from '@faker-js/faker';

import onefakerest from '../index.js';

function createTestServer (handler) {
  const server = http.createServer(handler);
  server.listen(8000);
  const originalClose = server.close;

  server.close = () => new Promise((resolve) => {
    server.close = originalClose;
    server.close(resolve);
  });

  return server;
}

const data = {
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
    records: 20,
    generator ({
      users
    }) {
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
};

test('server returns not found', async (t) => {
  t.plan(1);

  faker.seed(1);
  const fakerest = onefakerest({
    data
  });

  const server = createTestServer(fakerest);

  const response = await axios('http://localhost:8000/nothing', {
    validateStatus: () => true
  });

  await server.close();

  t.equal(response.status, 404, 'had the correct status code');
});

test('server works', async (t) => {
  t.plan(2);

  faker.seed(1);
  const fakerest = onefakerest({
    data
  });

  const server = createTestServer(fakerest);

  const response = await axios('http://localhost:8000/users');

  await server.close();

  t.equal(response.data.length, 2, 'had the correct amount of records');
  t.deepEqual(
    response.data,
    [{
      id: '6fbe024f-2316-4265-a6e8-d65a837e308a',
      firstName: 'Tatyana',
      lastName: 'Johnson',
      noteCount: 11
    },
    {
      id: '7862f3cc-bfc5-41b8-aded-1d0420ea196a',
      firstName: 'Vernie',
      lastName: 'Jenkins',
      noteCount: 9
    }]
  );
});

test('server works - with pagination', async (t) => {
  t.plan(2);

  faker.seed(1);
  const fakerest = onefakerest({
    pagination: {
      limit: 5
    },
    data
  });

  const server = createTestServer(fakerest);

  const response = await axios('http://localhost:8000/notes');

  await server.close();

  t.equal(response.data.length, 5, 'had the correct amount of records');
  t.deepEqual(
    response.data,
    [
      {
        id: '3b452acd-600c-49fa-b447-c31177e14e41',
        userId: '7862f3cc-bfc5-41b8-aded-1d0420ea196a',
        subject: 'Explicabo rem perferendis veritatis dolorum.',
        content: 'Eveniet modi magnam dignissimos. Eaque molestias sint iste fugit sapiente provident. Rerum consectetur architecto deleniti commodi. Quidem dignissimos commodi atque eaque cumque deleniti aperiam id odit. Minus hic voluptatem cupiditate accusamus saepe atque. In odit debitis maxime.\nDeleniti magni mollitia recusandae corporis exercitationem. Nobis officia libero sunt accusamus harum error. Nobis ullam exercitationem optio tempora ullam necessitatibus eligendi. Accusamus delectus aut id ducimus error.'
      },
      {
        id: '1cf1759f-663c-4ec9-80c9-25980eb57ec9',
        userId: '6fbe024f-2316-4265-a6e8-d65a837e308a',
        subject: 'Nihil aut modi itaque repellendus.',
        content: 'Repellat ab dolores nihil aspernatur soluta itaque. Quidem quam ab amet. Praesentium eligendi neque repudiandae aperiam expedita totam sunt dolores. Aliquid sit beatae. Praesentium velit architecto.\nAtque consectetur quos reiciendis quibusdam. Sunt consectetur incidunt et cupiditate. Reiciendis autem molestias nemo perferendis placeat quod. Consectetur distinctio maxime iste laboriosam. Pariatur nobis soluta vel quas vel. Corporis ipsa sed sunt.'
      },
      {
        id: '0e1c39b0-8a02-414f-9943-142b23f95f0d',
        userId: '7862f3cc-bfc5-41b8-aded-1d0420ea196a',
        subject: 'Cum adipisci magnam dignissimos neque.',
        content: 'Assumenda debitis quia optio perferendis mollitia ab doloremque odio facere. Optio excepturi voluptate enim voluptatum doloribus beatae. Fugit suscipit praesentium quos ipsum soluta voluptates. Quam modi aspernatur ab cumque ipsam dolorem similique. Dolorem quasi eligendi.\nUllam eius quasi. Fugit sequi itaque officia sint rem temporibus recusandae error. Minima ab libero tempore rem.'
      },
      {
        id: 'be2ea063-b9cf-46fe-83e0-ae64729087ec',
        userId: '7862f3cc-bfc5-41b8-aded-1d0420ea196a',
        subject: 'Repudiandae ipsam nisi omnis delectus.',
        content: 'Ullam sunt inventore aspernatur. Praesentium aut perferendis esse tenetur sapiente assumenda veniam. Nihil eos beatae.\nExplicabo officiis placeat deleniti nostrum ut hic. Occaecati necessitatibus vero adipisci quibusdam. Saepe delectus esse. Corrupti exercitationem quod occaecati labore explicabo.'
      },
      {
        id: 'f950f936-3cd5-43ed-9823-c9900060a6e9',
        userId: '6fbe024f-2316-4265-a6e8-d65a837e308a',
        subject: 'Alias pariatur voluptatibus quisquam voluptas.',
        content: 'Inventore omnis quia assumenda dolorem sint commodi similique exercitationem ut. Cupiditate quidem nobis illo nulla accusantium eligendi quisquam. Necessitatibus pariatur alias ad modi laborum nihil voluptate. Suscipit adipisci ea sit ex.\nExplicabo error molestias eum magni. Autem dolorum fuga nesciunt tempora vel consequatur nostrum dolor quod. Accusamus earum saepe. Id totam tempora aut non magnam fugiat atque voluptatum. Quod qui sint veritatis tempore aperiam totam reprehenderit impedit.'
      }
    ]
  );
});

test('server works - with pagination - page 2', async (t) => {
  t.plan(2);

  faker.seed(1);
  const fakerest = onefakerest({
    pagination: {
      limit: 5
    },
    data
  });

  const server = createTestServer(fakerest);

  const response = await axios('http://localhost:8000/notes?page=2');

  await server.close();

  t.equal(response.data.length, 5, 'had the correct amount of records');
  t.deepEqual(
    response.data,
    [{
      id: '917c5a1c-6b13-4f02-8cdd-1ba92287e573',
      userId: '6fbe024f-2316-4265-a6e8-d65a837e308a',
      subject: 'Illum provident temporibus quaerat odit.',
      content: 'Eveniet nihil numquam ipsum vitae reprehenderit sequi. Ducimus veniam libero consequatur neque blanditiis. Laborum fugiat ipsa commodi. Natus omnis consectetur ad. Debitis laudantium quisquam. Ipsum sed nesciunt error dolorum corrupti.\nPraesentium fugit doloribus nobis fugit dolor aperiam totam. Porro distinctio sit quaerat minima nisi at inventore quibusdam ullam. Alias pariatur error tenetur nesciunt assumenda error.'
    },
    {
      id: '510abbc9-6cb0-49cf-b445-43aa5cc879c0',
      userId: '7862f3cc-bfc5-41b8-aded-1d0420ea196a',
      subject: 'Asperiores in magnam reiciendis fugit.',
      content: 'Quos atque ea voluptatibus delectus culpa nesciunt asperiores asperiores corrupti. Rem placeat aspernatur esse ullam officiis sit deleniti. Occaecati soluta voluptates voluptatem. Nemo libero nulla maxime quidem.\nOdio ratione quibusdam reprehenderit quas occaecati tempora asperiores. Neque incidunt non amet eius deserunt. Repudiandae esse nesciunt ipsa accusamus praesentium quam dolorem nam. Aliquam magnam odio voluptatem neque perspiciatis et quibusdam magni.'
    },
    {
      id: '8bc8e83f-bc40-49b2-b5f1-384b17651da0',
      userId: '6fbe024f-2316-4265-a6e8-d65a837e308a',
      subject: 'Maxime laboriosam quidem esse cumque.',
      content: 'Eveniet quibusdam incidunt eum facere. Animi similique aut fugit tempore inventore unde perferendis dolorum. Cupiditate esse sint. Corporis voluptatem sapiente. Doloribus nisi laboriosam soluta temporibus voluptate maiores in cupiditate.\nMolestiae veritatis maxime asperiores ex quo saepe asperiores. Mollitia impedit accusantium. Distinctio natus harum consequatur. Atque beatae alias ut a quo saepe.'
    },
    {
      id: 'c8eb2129-3d9b-4e8f-9bbb-4ef693a271ed',
      userId: '7862f3cc-bfc5-41b8-aded-1d0420ea196a',
      subject: 'Vero fugit illum modi deserunt.',
      content: 'Quaerat ut maiores asperiores modi quod deleniti. Enim impedit eveniet sunt nemo repudiandae eum. Laudantium amet earum. Voluptatem aliquam distinctio odio debitis mollitia sit fugit rem. Minima officiis nulla officiis quas. Harum modi voluptate accusamus similique ducimus labore.\nDebitis sint neque. Possimus totam temporibus voluptates rem. Consequuntur non tenetur ipsam ipsa itaque. Earum sint quibusdam voluptas repudiandae officia amet explicabo veritatis ea.'
    },
    {
      id: '5522d916-fd22-47b2-be97-560430a27c82',
      userId: '6fbe024f-2316-4265-a6e8-d65a837e308a',
      subject: 'Dolores cupiditate excepturi recusandae repellat.',
      content: 'Voluptate perspiciatis quia voluptatibus aliquam saepe cumque perspiciatis similique. Expedita quasi sequi. Ab voluptate accusamus.\nVoluptatibus omnis magni a voluptatibus. Cumque sequi assumenda magni culpa error. Ipsa molestiae minima aut maiores ullam impedit dignissimos. Libero cupiditate nihil reprehenderit.'
    }]
  );
});
