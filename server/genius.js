const request = require('./request');
const cheerio = require('cheerio');

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
  // url.searchParams.set('page', 1);

  return (await submitRequestToGeniusAPI(url)).response.hits;
}

async function scrapeHTML(url, targets = ['album', 'lyrics']) {
  const html = await request(url);
  const $ = cheerio.load(html);
  const albumTitle = $('.song_album-info-title').text().trim();
  const lyrics = $('.lyrics').text().trim();
  return [albumTitle, lyrics];
}

exports.queryAPI = queryAPI;
exports.scrapeHTML = scrapeHTML;
