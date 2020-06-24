// require('../utils/envvar')();
const request = require('./request');

let accessToken = '';

async function requestTokenFromAPI() {
  const clientKey = process.env.SPOTIFY_CLIENT_KEY;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const auth = Buffer.from(`${clientKey}:${clientSecret}`).toString('base64');
  const postData = new URLSearchParams([['grant_type', 'client_credentials']]);
  const url = new URL('https://accounts.spotify.com/api/token');
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
    },
    content: postData,
  };
  console.log('Requesting Spotify access token');
  return request(url, options);
}

async function getToken() {
  if (!accessToken) {
    console.log('Invalid Spotify access token');
    try {
      const {
        access_token: token,
        token_type: tokenType,
        expires_in: expiresIn,
      } = await requestTokenFromAPI();
      console.log('Spotify access token received');
      accessToken = `${tokenType} ${token}`;

      // clear access token 60sec prior to expiration, to avoid race condition
      setTimeout(() => {
        accessToken = '';
        console.log('Spotify access token has expired.');
      }, (expiresIn - 60) * 1000);
    } catch (e) {
      throw new Error(`Failed to get Spotify access token: ${e}`);
    }
  }
  return accessToken;
}

async function querySpotifyAPI(track) {
  const token = await getToken();
  const url = new URL('https://api.spotify.com');
  url.pathname = '/v1/search';
  url.searchParams.set('type', 'track');
  url.searchParams.set('limit', 5);
  url.searchParams.set('offset', 0);
  url.searchParams.set(
    'q',
    `track:"${track.title}" album:"${track.album}" artist:"${track.artist}"`
  );
  const options = {
    headers: {
      Authorization: token,
    },
  };
  console.log('Submitting query request to Spotify API');
  return request(url, options);
}

async function getTrack() {
  try {
    const track = {
      title: 'Feeling Good',
      artist: 'Muse',
      album: '',
    };
    const {
      tracks: { items },
    } = await querySpotifyAPI(track);
    console.log(`Received ${items.length} matches to query`);
    // console.log(items);
    if (items.length) {
      const candidates = items.reduce((result, item) => {
        if (
          (item.name === track.title &&
          item.artists[0].name === track.artist)
         &&
           (track.album==='' || item.album.name === track.album)) {
            result.push([item.name, item.album.name, item.uri]);
          }
        return result;
      }, []);
      if (candidates.length > 1) {
        // TODO: disambiguate
        console.log('more than one');
      }
      console.log(candidates[0]);
    }
  } catch (e) {
    console.log(e);
  }
}

exports.getTrack = getTrack;
