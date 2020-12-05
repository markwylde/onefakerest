function createFakeDatastore (config) {
  const store = {};

  for (const collectionName in config) {
    const collectionConfig = config[collectionName];

    store[collectionName] = [];

    for (let i = 0; i < collectionConfig.records; i++) {
      store[collectionName].push(collectionConfig.generator(store));
    }
  }

  return store;
}

function onefakerest (config) {
  const store = createFakeDatastore(config.data);

  return function (request, response) {
    const parsedUrl = new URL(request.url, `http://${request.headers.host}`);

    const collectionData = store[parsedUrl.pathname.slice(1)];

    if (!collectionData) {
      response.writeHead(404);
      response.end('Not Found');
      return;
    }

    response.end(JSON.stringify(collectionData));
  };
}

module.exports = onefakerest;
