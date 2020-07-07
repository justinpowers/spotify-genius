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

  const maxPages = 3;
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

  let attempts = 0;
  while (!htmlCache[url] && attempts < 2) {
    try {
      attempts += 1;
      htmlCache[url] = await request(url);
      setTimeout(() => {
        delete htmlCache[url];
      }, 5 * 60 * 1000);
    } catch (e) {
      console.log('Failed %s attempts to get html for %s', attempts, url);
    }
  }

  const $ = cheerio.load(htmlCache[url]);

  const results = [];

  targets.forEach((target) => {
    if (targetClass[target]) {
      results.push($(targetClass[target]).text().trim());
    }
  });

  if (targets.includes('spotifyId')) {
    const spotifyIdRegEx = /"spotify_uuid":"([^"]+)"/;
    const match = spotifyIdRegEx.exec(
      $("meta[itemprop='page_data']").attr('content')
    );
    const spotifyId = match != null ? match[1] : '';
    results.push(spotifyId);
  }

  if (targets.includes('primaryTag')) {
    const primaryTagRegEx = /{"key":"Primary Tag","value":"([^"]+)"}/;
    const match = primaryTagRegEx.exec(
      $("meta[itemprop='page_data']").attr('content')
    );
    const primaryTagId = match != null ? match[1] : '';
    results.push(primaryTagId);
  }

  return results;
}

async function getAlbum(url) {
  const [album] = await scrapeHTML(url, ['album']);
  return album;
}

async function getLyrics(url) {
  const [lyrics] = await scrapeHTML(url, ['lyrics']);
  return lyrics;
}

async function getSpotifyId(url) {
  const [spotifyId] = await scrapeHTML(url, ['spotifyId']);
  return spotifyId;
}

async function getPrimaryTag(url) {
  const [primaryTag] = await scrapeHTML(url, ['primaryTag']);
  return primaryTag;
}

module.exports = {
  getAlbum,
  getLyrics,
  getSpotifyId,
  getPrimaryTag,
  queryAPI,
  scrapeHTML,
};
