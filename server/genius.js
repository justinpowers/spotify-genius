const https = require('https');

function submitRequestToGeniusAPI(endpoint, params = []) {
  return new Promise((resolve, reject) => {
    const url = new URL('https://api.genius.com');
    url.pathname = endpoint;
    params.forEach((value, key) => url.searchParams.set(key, value));
    url.searchParams.set('access_token', process.env.GENIUS_ACCESS_TOKEN);

    console.group('Outgoing Request');
    console.log(url);
    const request = https.get(url, (response) => {
      console.group('Incoming Response');
      console.log(' Status Code: ', response.statusCode);
      console.log(' Headers: ', response.headers);

      const data = [];
      response.on('data', (chunk) => {
        console.count(`Data chunk received`);
        data.push(chunk);
      });

      response.on('end', () => {
        console.log('End of data stream.');
        console.countReset(`Data chunk received`);
        console.groupEnd('Incoming Response');
        resolve(JSON.parse(Buffer.concat(data).toString()));
      });

      response.on('error', (error) => {
        console.log('Response Error Occurred: ', error);
        reject(error);
      });
    });

    request.on('error', (error) => {
      console.log('Request Error Occurred: ', error);
      reject(error);
    });
    console.groupEnd('Outgoing Request');
  });
}

async function queryGeniusAPI(searchTerm) {
  const endpoint = '/search';
  const resultsPerPage = 20;
  const params = new Map([
    ['q', searchTerm],
    ['per_page', Math.min(20, resultsPerPage)],
    ['page', 1],
  ]);
  let results = [];
  try {
    const {
      response: { hits },
    } = await submitRequestToGeniusAPI(endpoint, params);
    results = hits.map(
      ({
        result: {
          id,
          title,
          primary_artist: { name: artist },
        },
      }) => ({
        id,
        title,
        artist,
      })
    );
  } catch (error) {
    console.log(error);
  }
  console.log('Genius Query Results: ', results);
  return results;
}

exports.queryGeniusAPI = queryGeniusAPI;
