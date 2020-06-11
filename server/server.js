require('dotenv').config();
const http = require('http');
const genius = require('./genius');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  console.log(`Received ${req.method} request for ${req.url}`);

  if (url.pathname !== '/lyrics') {
    res.statusCode = 404;
    res.statusMessage = 'Not Found';
  } else if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.statusMessage = 'Bad Method';
    res.setHeader('Allow', 'HEAD, GET');
  } else if (!url.searchParams.has('q')) {
    res.statusCode = 400;
    res.statusMessage = 'Bad Request - Missing Query Parameter';
  }

  let body = '';
  if (res.statusCode >= 400) {
    res.setHeader('Content-Type', 'text/html');
    body = `<h1>${res.statusCode}: ${res.statusMessage}</h1>`;
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    const results = await genius.queryGeniusAPI(url.searchParams.get('q'));
    body = JSON.stringify(results);
  }

  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.writeHead(res.statusCode);
  res.end(body);
});

const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;
server.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}...`);
});
