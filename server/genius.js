const fetch = require('node-fetch');

async function submitGeniusAPIRequest(endpoint, params = []) {
  const url = new URL('https://api.genius.com');
  url.pathname = endpoint;
  url.searchParams.set('access_token', tkn);
  params.forEach((value, key) => url.searchParams.set(key, value));
  let response = {};
  try {
    response = await fetch(url);
    response = await response.json();
  } catch (error) {
    console.log(error);
  }
  return response;
}

async function getAlbum(songID) {
  const endpoint = `/songs/${songID}`;
  let album = '';
  try {
    const { response } = await submitGeniusAPIRequest(endpoint);
    album = response.song.album.name;
  } catch (error) {
    console.log(error);
  }
  return album;
}

// scrape the website for lyrics to determine if the search results
//   were accurate. Genius likes to return matches where the match
//   is of an artist or title, and the lyrics have no match. This is
//   not what i want.
// async function getLyrics() {}

async function queryGeniusAPI(searchTerm) {
  const resultsPerPage = 20; // 20 is the max; use 'page' for more
  const endpoint = '/search';
  const params = new Map([
    ['q', searchTerm],
    ['per_page', resultsPerPage],
  ]);
  console.log(params);
  const { response } = await submitGeniusAPIRequest(endpoint, params);
  let results = [];
  try {
    if (response.hits.length > 0) {
      results = await Promise.all(
        response.hits.map(async (hit) => ({
          url: hit.result.url,
          id: hit.result.id,
          title: hit.result.title,
          artist: hit.result.primary_artist.name,
          album: await getAlbum(hit.result.id),
        }))
      );
    }
  } catch (error) {
    console.log(error);
  }
  return results;
}

/*
async function getSongsWithLyricsContaining(term) {
  const results = await queryGeniusAPI(term);
  console.log(results);
  results.forEach(async (result) => {
    // get html from url as string
    const html = await fetch(result.url);
    console.log(html);
    // create dom from html string
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    // select dom element with class 'lyrics'
    // strip lyrics element of all html
    // count number of occurences of term in lyrics
    // if term is present in lyrics
    //   then store and get song title, artist and album
    // else discard
    // sort by count of occurence in lyrics, high to low
  });
  // return current set of matches to
}
*/

const tkn = process.env.GENIUS_ACCESS_TOKEN;

exports.queryGeniusAPI = queryGeniusAPI;
