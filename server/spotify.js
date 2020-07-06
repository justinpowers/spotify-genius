const request = require('./request');

let accessTokenPromise;

async function requestTokenFromAPI() {
  const clientKey = process.env.SPOTIFY_CLIENT_KEY;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const basicAuth = `Basic ${Buffer.from(
    `${clientKey}:${clientSecret}`
  ).toString('base64')}`;
  const postData = new URLSearchParams([['grant_type', 'client_credentials']]);
  const url = new URL('https://accounts.spotify.com/api/token');
  const options = {
    method: 'POST',
    headers: { Authorization: basicAuth },
    content: postData,
  };
  return request(url, options);
}

function getTokenPromise() {
  if (!accessTokenPromise) {
    console.log('No available access token. Requesting a new one...');
    accessTokenPromise = requestTokenFromAPI()
      .then(
        ({
          access_token: accessToken,
          token_type: tokenType,
          expires_in: expiresIn,
        }) => {
          // clear access token promise 60sec prior to expiration
          setTimeout(() => {
            accessTokenPromise = undefined;
            console.log('Spotify access token has expired.');
          }, (expiresIn - 60) * 1000);
          return `${tokenType} ${accessToken}`;
        }
      )
      .catch((e) => console.log('Access token request failed: ', e));
  }
  console.log('Returning access token promise');
  return accessTokenPromise;
}



async function getTracksById(trackIds) {
  console.log(trackIds.length);
  if (trackIds.length === 0) {
    return {};
  }
  const ids = trackIds;
  // break up tracks into arrays of 50
  // create an array of arrays of max size 50
  const idsPerRequest = [];
  while (ids.length > 50) {
    idsPerRequest.push(ids.splice(0, 50));
  }
  idsPerRequest.push(ids.splice(0));
  console.log(idsPerRequest);

  const token = await getTokenPromise();
  const url = new URL('https://api.spotify.com');
  url.pathname = 'v1/tracks';

  // promiseall map this array with requests
  const tracks = (
    await Promise.all(
      idsPerRequest.map(async (requestIds) => {
        url.searchParams.set('ids', requestIds);
        const t = await request(url, {
          headers: { Authorization: token },
        });
        return t.tracks;
      })
    )
  ).flat();

  const parsedTracks = parseQueryResults(tracks);

  const tracksById = {};
  parsedTracks.forEach((track) => {
    tracksById[track.id] = track;
  });
  console.log(tracksById);
  return tracksById;
}

async function queryAPI(track) {
  const token = await getTokenPromise();
  const url = new URL('https://api.spotify.com');
  url.pathname = '/v1/search';
  url.searchParams.set('type', 'track');
  url.searchParams.set('limit', 5);
  url.searchParams.set('offset', 0);
  // TODO: inspect and handle potential double-quotes in terms
  let q = '';
  q += track.title ? `track:"${track.title}"` : '';
  q += track.album ? ` album:"${track.album}"` : '';
  q += track.artist ? ` artist:"${track.artist}"` : '';

  url.searchParams.set(
    'q',
   // `track:"${track.title}" album:"${track.album}" artist:"${track.artist}"`
    q
  );
  console.log('Querying Spotify API for: ', url.searchParams.get('q'));
  const {
    tracks: { items },
  } = await request(url, { headers: { Authorization: token } });
  const parsedResults = parseQueryResults(items);
  return parsedResults;
}

function parseQueryResults(
  items,
  props = [
    'id',
    'title',
    'artist',
    'album',
    'releaseDate',
    'explicit',
    'image',
    'uri',
  ]
) {
  const apiProps = {
    id: 'id',
    title: 'name',
    artist: 'artists[0].name',
    album: 'album.name',
    releaseDate: 'album.release_date',
    explicit: 'explicit',
    image: 'album.images[2].url',
    uri: 'uri',
  };

  return items.map((item) => {
    const extractedData = {};
    props.forEach((prop) => {
      if (apiProps[prop]) {
        extractedData[prop] = eval(`item.${apiProps[prop]}`);
      } else {
        extractedData[prop] = '';
      }
    });
    return extractedData;
  });
}

async function getTrack() {
  try {
    const {
      tracks: { items },
    } = await queryAPI(track);
    console.log(`Received ${items.length} matches to query`);
    if (items.length) {
      const candidates = items.reduce((result, item) => {
        if (
          item.name === track.title &&
          item.artists[0].name === track.artist &&
          (track.album === '' || item.album.name === track.album)
        ) {
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
exports.queryAPI = queryAPI;
exports.getTracksById = getTracksById;
