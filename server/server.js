require('dotenv').config();
const http = require('http');
const genius = require('./genius');

const routes = {
  '/songs': {
    HEAD: '',
    GET: 'search',
  },
};

const server = http.createServer(async (req, res) => {
  try {
    const { method, headers } = req;
    const url = new URL(req.url, `http://${headers.host}`);
    const route = url.pathname;

    console.log(`Received ${method} request for ${url}`);

    if (!(route in routes)) {
      res.statusCode = 404;
      res.statusMessage = 'Not Found';
    } else if (!(method in routes[route])) {
      res.statusCode = 405;
      res.statusMessage = 'Bad Method';
      res.setHeader('Allow', Object.keys(routes[route]).join(', '));
    } else if (!url.searchParams.get('lyrics')) {
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
  } catch (error) {
    console.log(error);
  }
});

const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;
server.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}...`);
});
