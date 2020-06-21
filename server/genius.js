const request = require('./request');

function submitRequestToGeniusAPI(endpoint, params = []) {
  const url = new URL('https://api.genius.com');
  url.pathname = endpoint;
  params.forEach((value, key) => url.searchParams.set(key, value));
  const accessToken = `BEARER ${process.env.GENIUS_ACCESS_TOKEN}`;
  const options = { headers: { Authorization: accessToken } };
  return request(url, options);
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
    const { response: { hits } } = await submitRequestToGeniusAPI(endpoint, params);
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
