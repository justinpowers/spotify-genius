require('../utils/envvar').load();
const http = require('http');
const fs = require('fs');
const path = require('path');
const tracks = require('./tracks');

function getMimeTypeFromExtName(fileName) {
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
  };
  return mimeTypes[path.extname(fileName)] || 'application/octet-stream';
}

const server = http.createServer(async (req, res) => {
  const { method, headers } = req;
  const url = new URL(req.url); // , `http://${headers.host}`);

  console.log(`Incoming ${method} request for ${url}`);
  console.log(' Headers: ', req.headers);

  let body = '';
  let contentType = 'application/octet-stream';

  console.log(url.pathname);
  if (url.pathname === '/tracks') {
    if (method === 'GET' || method === 'HEAD') {
      res.statusCode = 200;
      contentType = 'application/json';
      const results = await tracks.getTracks(url.searchParams);
      body = JSON.stringify(results);
    } else {
      res.statusCode = 405;
      res.setHeader('Allow', 'HEAD, GET');
    }
  } else {
    const baseDir = './build';
    const filePath =
      baseDir + (url.pathname === '/' ? '/index.html' : url.pathname);
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
      if (method === 'GET' || method === 'HEAD') {
        res.statusCode = 200;
        contentType = getMimeTypeFromExtName(filePath);
        const data = await fs.promises.readFile(filePath, 'utf8');
        body = contentType === 'application/json' ? JSON.stringify(data) : data;
      } else {
        res.statusCode = 405;
        res.setHeader('Allow', 'HEAD, GET');
      }
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.log(`Could not read ${url.pathname}`, e);
        res.statusCode = 404;
      } else {
        console.log(`Unexpected error during response: `, e);
        res.statusCode = 500;
      }
    }
  }

  const statusMessages = {
    200: 'OK',
    400: 'Bad Request',
    404: 'Not Found',
    405: 'Bad Method',
    500: 'Internal Server Error',
  };
  res.statusMessage = statusMessages[res.statusCode];

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
