require('dotenv').config();
const http = require('http');
const songs = require('./songs');

// not a fan of this structure, but for now...
//   probably should move this data into the imported file
//   also, requires error-prone redundant head/get handler declaration
const routes = {
  '/songs': {
    methods: {
      HEAD: {
        handler: songs.getSongs,
      },
      GET: {
        handler: songs.getSongs,
      },
    },
  },
};

const server = http.createServer(async (req, res) => {
  try {
    const { method, headers } = req;
    const url = new URL(req.url, `http://${headers.host}`);
    const route = url.pathname;

    console.log(`Incoming ${method} request for ${url}`);
    console.log(' Headers: ', req.headers);

    // I'm not a big fan of this nested-if method, but...
    let body = '';
    if (route in routes) {
      const { methods } = routes[route];
      if (method in methods || (method === 'HEAD' && 'GET' in methods)) {
        const { handler } = methods[method];
        const results = await handler(url.searchParams);
        // COUPLING!: assumes json
        body = JSON.stringify(results);
      } else {
        res.statusCode = 405;
        res.statusMessage = 'Bad Method';
        res.setHeader('Allow', Object.keys(methods).join(', '));
        res.setHeader('Content-Type', 'text/html');
        body = `<h1>${res.statusCode}: ${res.statusMessage}</h1>`;
      }
    } else {
      res.statusCode = 404;
      res.statusMessage = 'Not Found';
      res.setHeader('Content-Type', 'text/html');
      body = `<h1>${res.statusCode}: ${res.statusMessage}</h1>`;
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
