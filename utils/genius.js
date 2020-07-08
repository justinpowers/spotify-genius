const cheerio = require('cheerio');
const request = require('./request');

function submitRequestToGeniusAPI(url) {
  const accessToken = `BEARER ${process.env.GENIUS_ACCESS_TOKEN}`;
  const options = { headers: { Authorization: accessToken } };
  return request(url, options);
}

async function queryAPI(searchTerm) {
  const url = new URL('https://api.genius.com');
  url.pathname = '/search';
  url.searchParams.set('q', searchTerm);
  url.searchParams.set('per_page', 20);

  const maxPages = 2;
  const pages = [];
  for (let page = 1; page <= maxPages; page += 1) {
    pages.push(page);
  }

  const allResults = await Promise.all(
    pages.map(async (page) => {
      url.searchParams.set('page', page);
      const {
        response: { hits },
      } = await submitRequestToGeniusAPI(url);
      return hits;
    })
  ).then((hits) => hits.flat());
  // console.log('Original Genius: ', allResults);

  const parsedResults = parseQueryResults(allResults);
  // console.log('Parsed Genius: ', parsedResults);
  return parsedResults;
}

function parseQueryResults(
  hits,
  props = ['id', 'title', 'artist', 'url', 'lyricsState']
) {
  const apiProps = {
    id: 'id',
    title: 'title',
    artist: 'primary_artist.name',
    url: 'url',
    lyricsState: 'lyrics_state',
  };

  return hits.map((hit) => {
    const extractedData = {};
    props.forEach((prop) => {
      if (apiProps[prop]) {
        extractedData[prop] = eval(`hit.result.${apiProps[prop]}`);
      } else {
        extractedData[prop] = '';
      }
    });
    return extractedData;
  });
}

const htmlCache = {};
async function scrapeHTML(url, targets = ['album', 'lyrics']) {
  const targetClass = {
    album: '.song_album-info-title',
    lyrics: '.lyrics',
  };

  let html;
  try {
    html = await request(url);
  } catch (e) {
    console.log('Failed to get html for %s', url);
    throw e;
  }

  const $ = cheerio.load(html);

  let album = '';
  if (targets.includes('album')) {
    album = $(targetClass.album).text().trim();
  }

  let lyrics = '';
  if (targets.includes('lyrics')) {
    lyrics = $(targetClass.lyrics).text().trim();
  }

  let spotifyId;
  if (targets.includes('spotifyId')) {
    const spotifyIdRegEx = /"spotify_uuid":"([^"]+)"/;
    const match = spotifyIdRegEx.exec(
      $("meta[itemprop='page_data']").attr('content')
    );
    spotifyId = match != null ? match[1] : '';
  }

  let primaryTag;
  if (targets.includes('primaryTag')) {
    const primaryTagRegEx = /{"key":"Primary Tag","value":"([^"]+)"}/;
    const match = primaryTagRegEx.exec(
      $("meta[itemprop='page_data']").attr('content')
    );
    primaryTag = match != null ? match[1] : '';
  }

  return [album, lyrics, spotifyId, primaryTag];
}

async function getDetails(url) {
  return scrapeHTML(url, ['album', 'lyrics', 'spotifyId', 'primaryTag']);
}

module.exports = {
  getDetails,
  queryAPI,
  scrapeHTML,
};
