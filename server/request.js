const https = require('https');

function request(url, { method = 'GET', headers = {}, content = null } = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers,
    };

    let body;
    if (content) {
      if (method === 'POST' && content instanceof URLSearchParams) {
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        body = content.toString();
      } else {
        body = content;
      }
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    console.log('Outgoing Req for: ', url.href);
    console.log('Request options: ', options);
    if (body) {
      console.log('Request body: ', body);
    }

    const req = https.request(url, options, (res) => {
      try {
        console.log('Incoming Response: ', res.headers.status);

        if (res.statusCode !== 200) {
          throw new Error(`Request Failed. Status Code: ${res.statusCode}`);
        }

        res.on('aborted', () => {
          throw new Error(`Response aborted before message completed.`);
        });

        const rawData = [];
        res.on('data', (chunk) => {
          rawData.push(chunk);
        });

        res.on('end', () => {
          try {
            if (!res.complete) {
              throw new Error(
                `Connection terminated before message completed.`
              );
            }
            console.log('Response data stream completed.');

            const contentType = res.headers['content-type'];
            let parsedData;
            if (contentType.includes('application/json')) {
              parsedData = JSON.parse(Buffer.concat(rawData).toString());
            } else if (contentType.includes('text/html')) {
              parsedData = Buffer.concat(rawData).toString();
            } else {
              throw new Error(
                `Invalid Content Type: "${contentType}". Expected application/json.`
              );
            }
            return resolve(parsedData);
          } catch (e) {
            return reject(e);
          }
        });
      } catch (e) {
        return reject(e);
      } finally {
        res.resume();
      }
    });

    req.on('error', (e) => {
      return reject(e);
    });

    req.end(body);
  });
}

module.exports = request;
