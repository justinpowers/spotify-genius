require('./utils/envvar').load();
const http = require('http');
const tracks = require('./api/tracks');

const server = http.createServer(async (req, res) => {
  let { method, headers, url } = req;
  console.log(`Incoming ${method} request for ${url} with headers:`, headers);
  url = new URL(url, `http://${headers.host}`);

  let body = '';
  let contentType = 'application/octet-stream';

  console.log(url.pathname);
  if (url.pathname === '/spotify-talks-to-a-genius/tracks') {
    if (method === 'GET' || method === 'HEAD') {
      try {
        const results = await tracks.getTracks(url.searchParams);
        body = JSON.stringify(results);
        contentType = 'application/json';
        res.statusCode = 200;
      } catch (e) {
	console.log(e);
	res.statusCode = 500;
      }
    } else {
      res.statusCode = 405;
      res.setHeader('Allow', 'HEAD, GET');
    }
  } else {
    res.statusCode = 404;
  }

  res.statusMessage = http.STATUS_CODES[res.statusCode];

  if (res.statusCode >= 400) {
    body = `<h1>${res.statusCode}: ${res.statusMessage}</h1>`;
    contentType = 'text/html';
  }

  res.writeHead(res.statusCode, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': contentType,
  });
  res.end(body);
});

const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;
server.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}...`);
});
