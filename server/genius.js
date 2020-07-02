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

  let allHits = [];
  let page = 0;
  let pagesReceived = 0;
  let hits;
  do {
    page += 1;
    url.searchParams.set('page', page);
    console.log('Getting page: ', page);
    /* eslint-disable no-await-in-loop */
    ({
      response: { hits },
    } = await submitRequestToGeniusAPI(url));
    /* eslint-enable no-await-in-loop */
    allHits = allHits.concat(hits);
    pagesReceived += 1;
  } while (hits.length > 0 && pagesReceived < 2);

  const parsedResults = parseQueryResults(allHits);
  return parsedResults;
}

function parseQueryResults(hits, props = ['id', 'title', 'artist', 'url', 'lyricsState']) {
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
  if (htmlCache[url]) {
    console.log(`Using cached html for url: ${url}`);
    html = htmlCache[url];
  } else {
    html = await request(url);
    console.log(`Caching html for url: ${url}`);
    htmlCache[url] = html;
    setTimeout(() => {
      delete htmlCache[url];
      console.log(`Deleting cached html for url: ${url}`);
    }, 5 * 60 * 1000);
  }

  const $ = cheerio.load(html);
  return targets.map((target) => $(targetClass[target]).text().trim());
}

async function getAlbum(url) {
  const [album] = await scrapeHTML(url, ['album']);
  return album;
}

async function getLyrics(url) {
  const [lyrics] = await scrapeHTML(url, ['lyrics']);
  return lyrics;
}

exports.getAlbum = getAlbum;
exports.getLyrics = getLyrics;
exports.queryAPI = queryAPI;
exports.scrapeHTML = scrapeHTML;
