function onefakerest () {
  return function (request, response) {
    response.end(JSON.stringify({ a: 1 }));
  };
}

module.exports = onefakerest;
