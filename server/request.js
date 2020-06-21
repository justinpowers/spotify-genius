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

    const outgoingMessageLabel = 'Outgoing Request';
    console.group(outgoingMessageLabel);
    // console.log(options);

    const req = https.request(url, options, (res) => {
      try {
        const messagingLabel = 'Incoming Response';
        console.group(messagingLabel);
        // console.log('Status Code: ', res.statusCode);
        // console.log('Headers: ', res.headers);

        if (res.statusCode !== 200) {
          throw new Error(`Request Failed. Status Code: ${res.statusCode}`);
        }

        res.on('aborted', () => {
          throw new Error(`Response aborted before message completed.`);
        });

        const dataMessage = 'Data chunk received';
        const rawData = [];
        res.on('data', (chunk) => {
          // cconsole.count(dataMessage);
          rawData.push(chunk);
        });

        res.on('end', () => {
          console.log('End of data stream.');
          // console.countReset(dataMessage);
          console.groupEnd(messagingLabel);
          try {
            if (!res.complete) {
              throw new Error(
                `Connection terminated before message completed.`
              );
            }
            const contentType = res.headers['content-type'];
            if (!contentType.includes('application/json')) {
              throw new Error(
                `Invalid Content Type: ${contentType}\n Expected application/json.`
              );
            }
            const parsedData = JSON.parse(Buffer.concat(rawData).toString());
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

    // console.log(body);
    req.end(body);

    console.groupEnd(outgoingMessageLabel);
  });
}

module.exports = request;
